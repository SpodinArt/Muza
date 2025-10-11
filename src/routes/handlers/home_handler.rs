use actix_web::{get, web, Responder, HttpResponse, Result as ActixResult, HttpRequest, dev::ServiceResponse, Error};
use sea_orm::{ConnectionTrait, Statement};
use crate::utils::{api_responce::{self, ApiResponse}, app_state::AppState};



#[get("/guest/{page}")]
pub async fn guest_page(path: web::Path<String>) -> Result<HttpResponse, ApiResponse> {
    let page = path.into_inner();
    let valid_pages = ["guest", "registration", "login"]; // Список разрешенных страниц
    
    if !valid_pages.contains(&page.as_str()) {
        return Err(ApiResponse::new(404, "Page not found".to_string()));
    }
    
    let content = std::fs::read_to_string(format!("static/{}.html", page))
        .map_err(|_| ApiResponse::new(500, "Failed to read page".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}

#[get("/guest")]
pub async fn guest_root() -> Result<HttpResponse, ApiResponse> {
    let content = std::fs::read_to_string("static/guest.html")
        .map_err(|_| ApiResponse::new(500, "Failed to read guest.html".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}


#[get("/registration")]
pub async fn registration_page() -> Result<HttpResponse, ApiResponse> {
    let content = std::fs::read_to_string("static/registration.html")
        .map_err(|_| ApiResponse::new(500, "Failed to read registration.html".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}

#[get("/test")]
pub async fn test(app_state: web::Data<AppState>) -> Result<ApiResponse,ApiResponse> {

    let res = app_state.db.query_all(Statement::from_string(sea_orm::DatabaseBackend::Postgres, "Select * from logins")).await
    .map_err(|err| ApiResponse::new(500, err.to_string()))?;
    Ok(api_responce::ApiResponse::new(200, "Test".to_string()))
}



#[get("/create")]
pub async fn create() -> Result<HttpResponse, ApiResponse> {
    let content = std::fs::read_to_string("static/create.html")
        .map_err(|_| ApiResponse::new(500, "Failed to read create.html".to_string()))?;
    
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(content))
}

#[get("/profile")]
pub async fn profile(name: web::Path<String>) -> Result<ApiResponse,ApiResponse> {
        let content = std::fs::read_to_string("static/profile.html")
        .map_err(|_| ApiResponse::new(500, "Failed to read profile.html".to_string()))?;
    Ok(api_responce::ApiResponse::new(200, "Test".to_string()))
}

pub async fn handle_404(req: HttpRequest) -> Result<HttpResponse, Error> {
    let content = std::fs::read_to_string("static/error.html")
        .unwrap_or_else(|_| {
            "<html><body><h1>404 - Page Not Found</h1><p>The requested page could not be found.</p></body></html>".to_string()
        });
    
    Ok(HttpResponse::NotFound()
        .content_type("text/html; charset=utf-8")
        .body(content))
}

pub async fn handle_500(req: HttpRequest) -> Result<HttpResponse, Error> {
    let content = std::fs::read_to_string("static/error.html")
        .unwrap_or_else(|_| {
            "<html><body><h1>500 - Internal Server Error</h1><p>Something went wrong on our end.</p></body></html>".to_string()
        });
    
    Ok(HttpResponse::InternalServerError()
        .content_type("text/html; charset=utf-8")
        .body(content))
}
