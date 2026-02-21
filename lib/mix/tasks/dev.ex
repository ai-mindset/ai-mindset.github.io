defmodule Mix.Tasks.Dev do
  @moduledoc "Build the site and start development server"
  @shortdoc "Build the site and start development server"

  use Mix.Task

  def run(args) do
    Mix.Task.run("build_site")
    Mix.Task.run("serve", args)
  end
end