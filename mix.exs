defmodule BlogBuilder.MixProject do
  use Mix.Project

  def project do
    [
      app: :blog_builder,
      version: "1.0.0",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :inets, :ssl]
    ]
  end

  defp deps do
    [
      {:earmark, "~> 1.4"},
      {:yaml_elixir, "~> 2.9"},
      {:jason, "~> 1.4"},
      {:plug_cowboy, "~> 2.7"}
    ]
  end
end