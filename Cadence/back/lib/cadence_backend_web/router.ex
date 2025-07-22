# lib/cadence_backend_web/router.ex
defmodule CadenceBackendWeb.Router do
  use CadenceBackendWeb, :router
  import Phoenix.Router


  pipeline :api_public do
    plug :accepts, ["json"]
    plug Plug.Parsers,
     parsers: [:urlencoded, :multipart, :json],
     pass: ["*/*"],
     json_decoder: Phoenix.json_library()
  end

  pipeline :api_protected do
    plug :accepts, ["json"]
    plug Plug.Parsers,
     parsers: [:urlencoded, :multipart, :json],
     pass: ["*/*"],
     json_decoder: Phoenix.json_library()
    plug CadenceBackendWeb.JWTAuthPlug
    plug :put_current_user
  end

  pipeline :dev_routes_pipeline do
    plug :fetch_session
    plug :protect_from_forgery
  end

  # --- NOVO BLOCO DE ROTA PARA O CAMINHO RAIZ (/) ---
  scope "/", CadenceBackendWeb do
    pipe_through :api_public # Usa o pipeline público para retornar JSON
    get "/", ApiController, :status
  end
  # --- FIM DO NOVO BLOCO ---


  scope "/api", CadenceBackendWeb do
    pipe_through :api_public
    post "/login", AuthController, :login
    post "/register", AuthController, :register
  end

  scope "/api", CadenceBackendWeb do
    pipe_through :api_protected
    get "/meetings", MeetingController, :index
    post "/meetings", MeetingController, :create
    get "/meetings/:id", MeetingController, :show
    get "/meetings/:id/chat", MeetingController, :get_chat_messages
    delete "/meetings/:id/chat", MeetingController, :clear_chat

    # Endpoint para dados do usuário autenticado
    get "/me", ApiController, :me
    put "/me", ApiController, :update_me

    # Endpoints de conversas
    get "/conversations", ConversationController, :index
    post "/conversations", ConversationController, :create

    # Endpoint de notificações
    get "/notifications", NotificationController, :index
    post "/notifications", NotificationController, :create
  end

  scope "/api", CadenceBackendWeb do
    pipe_through :api_protected
    post "/invite", InviteController, :invite
  end

  if Application.compile_env(:cadence_backend, :dev_routes) do
    import Phoenix.LiveDashboard.Router

    scope "/dev", CadenceBackendWeb do
      pipe_through :dev_routes_pipeline
      live_dashboard "/dashboard", metrics: CadenceBackendWeb.Telemetry
    end
  end

  defp put_current_user(conn, _opts) do
    if !conn.assigns[:current_user] do
      assign(conn, :current_user, %{id: "anonymous_user", name: "Anônimo"})
    else
      conn
    end
  end

end
