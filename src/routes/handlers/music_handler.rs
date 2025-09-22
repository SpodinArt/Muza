use actix_web::{get, web, Responder};
use serde_json::json;

#[get("/filters")]
pub async fn get_filters() -> impl Responder{
    let filters = json!({
        "difficulties": ["easy", "medium", "hard"],
        "instruments": ["guitar", "piano", "violin"],
        "tonalities": ["C", "G", "D", "A", "E", "F", "Am", "Em", "Dm"]
    });
    web::Json(filters)
}