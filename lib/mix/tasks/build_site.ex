defmodule Mix.Tasks.BuildSite do
  @moduledoc "Build the static blog site"
  @shortdoc "Build the static blog site"

  use Mix.Task

  def run(_args) do
    BlogBuilder.build()
  end
end