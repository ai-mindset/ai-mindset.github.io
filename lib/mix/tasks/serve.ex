defmodule Mix.Tasks.Serve do
  @moduledoc "Start HTTP server to serve the static blog site"
  @shortdoc "Start HTTP server to serve the static blog site"

  use Mix.Task

  def run(args) do
    Mix.Task.run("app.start")

    port = case args do
      [port_str] -> String.to_integer(port_str)
      _ -> 8000
    end

    BlogServer.start_server(port)
  end
end