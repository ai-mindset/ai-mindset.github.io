defmodule BlogServer do
  use Plug.Router

  plug Plug.Static,
    at: "/",
    from: ".",
    only: ~w(index.html about.html aihub.html style.css script.js posts posts.json images assets)

  plug :match
  plug :dispatch

  get "/" do
    send_file(conn, 200, "index.html")
  end

  match _ do
    send_resp(conn, 404, "Page not found")
  end

  def start_server(port \\ 8000) do
    IO.puts("Starting server on http://localhost:#{port}")
    Plug.Cowboy.http(__MODULE__, [], port: port)
    Process.sleep(:infinity)
  end
end