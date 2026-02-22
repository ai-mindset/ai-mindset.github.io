defmodule BlogBuilder do
  @posts_dir "_posts"
  @posts_output_dir "posts"
  @json_output "posts.json"

  def build do
    IO.puts("Building blog...")

    File.mkdir_p!(@posts_output_dir)

    post_template = File.read!("post-template.html")

    posts = process_markdown_files(post_template)
    process_standalone_markdown(post_template)

    IO.puts("Build complete!")
    {:ok, length(posts)}
  end

  defp process_markdown_files(post_template) do
    posts =
      @posts_dir
      |> File.ls!()
      |> Enum.filter(&String.ends_with?(&1, ".md"))
      |> Enum.map(&process_post_file(&1, post_template))
      |> Enum.reject(&is_nil/1)
      |> Enum.sort_by(&Date.from_iso8601!(&1.date), {:desc, Date})

    File.write!(@json_output, Jason.encode!(posts, pretty: true))
    IO.puts("Processed #{length(posts)} posts")

    posts
  end

  defp process_post_file(filename, post_template) do
    filepath = Path.join(@posts_dir, filename)
    content = File.read!(filepath)

    case parse_front_matter(content) do
      {front_matter, body} when is_map(front_matter) ->
        if Map.get(front_matter, "draft"), do: nil, else: build_post(filename, front_matter, body, post_template)
      _ ->
        nil
    end
  end

  defp parse_front_matter(content) do
    case Regex.run(~r/^---\s*\n(.*?)\n---\s*\n(.*)/s, content) do
      [_, yaml_content, body] ->
        case YamlElixir.read_from_string(yaml_content) do
          {:ok, front_matter} when is_map(front_matter) -> {front_matter, body}
          _ -> {%{}, content}
        end
      _ ->
        {%{}, content}
    end
  end

  defp build_post(filename, front_matter, body, post_template) do
    slug = extract_slug(filename)
    date_str = extract_date_from_filename(filename)

    html_content = Earmark.as_html!(body, gfm: true, breaks: true)

    post = %{
      title: Map.get(front_matter, "title", ""),
      date: Map.get(front_matter, "date", date_str),
      tags: Map.get(front_matter, "tags", []),
      url: "/posts/#{slug}.html",
      content: html_content
    }

    generate_post_html(post, slug, post_template)
    post
  end

  defp extract_slug(filename) do
    filename
    |> String.slice(11..-4//1)  # Remove YYYY-MM-DD- prefix and .md suffix
  end

  defp extract_date_from_filename(filename) do
    filename
    |> String.slice(0..9)  # Extract YYYY-MM-DD
  end

  defp generate_post_html(post, slug, post_template) do
    formatted_date =
      case Date.from_iso8601(post.date) do
        {:ok, date} ->
          "#{Date.to_string(date) |> String.replace("-", " ") |> String.split() |> format_date_parts()}"
        _ ->
          post.date
      end

    tags_html =
      post.tags
      |> Enum.map(&~s(<span class="post-tag">#{&1}</span>))
      |> Enum.join("")

    html =
      post_template
      |> String.replace("POST_TITLE", post.title)
      |> String.replace("POST_DATE", formatted_date)
      |> String.replace("<!-- POST_TAGS will be inserted here -->", tags_html)
      |> String.replace("<!-- POST_CONTENT will be inserted here -->", post.content)

    output_path = Path.join(@posts_output_dir, "#{slug}.html")
    File.write!(output_path, html)
    IO.puts("Generated #{output_path}")
  end

  defp format_date_parts([year, month, day]) do
    month_names = %{
      "01" => "January", "02" => "February", "03" => "March", "04" => "April",
      "05" => "May", "06" => "June", "07" => "July", "08" => "August",
      "09" => "September", "10" => "October", "11" => "November", "12" => "December"
    }

    month_name = Map.get(month_names, month, month)
    day_num = String.to_integer(day) |> to_string()
    "#{month_name} #{day_num}, #{year}"
  end

  defp process_standalone_markdown(post_template) do
    ["about.md", "aihub.md"]
    |> Enum.each(&process_standalone_file(&1, post_template))
  end

  defp process_standalone_file(filename, post_template) do
    if File.exists?(filename) do
      content = File.read!(filename)

      {front_matter, body} = parse_front_matter(content)

      {title, cleaned_body} = extract_title_from_markdown(body)

      html_content = Earmark.as_html!(cleaned_body, gfm: true, breaks: true)

      page = %{
        title: Map.get(front_matter, "title", title),
        content: html_content
      }

      slug = String.replace(filename, ".md", "")
      generate_standalone_html(page, slug, post_template)
    end
  end

  defp extract_title_from_markdown(body) do
    case Regex.run(~r/^\s*#\s+(.+)$/m, body) do
      [match, title] ->
        cleaned_body = String.replace(body, match, "") |> String.trim()
        {title, cleaned_body}
      nil ->
        {"", body}
    end
  end

  defp generate_standalone_html(page, slug, post_template) do
    html =
      post_template
      |> String.replace("POST_TITLE", page.title)
      |> String.replace("POST_DATE", "")
      |> String.replace(~r/<div class="post-tags">[\s\S]*?<\/div>/, "")
      |> String.replace("<!-- POST_CONTENT will be inserted here -->", page.content)

    output_path = "#{slug}.html"
    File.write!(output_path, html)
    IO.puts("Generated #{output_path}")
  end
end