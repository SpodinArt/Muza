use actix_web::{get, post, web, Responder};
use actix_multipart::{self, form::{tempfile::TempFile, MultipartForm}, Multipart};
use serde_json::json;
use serde::Deserialize;
use crate::utils::{api_responce::{self, ApiResponse}, app_state};

#[derive(Debug, Deserialize)]
pub struct SearchPieces{
    pub difficulty: String,
    pub instrument: String,
    pub tonality: String
}

#[get("/work/filters")]
pub async fn get_filters() -> Result<ApiResponse,ApiResponse>{
    let filters = json!({
        "difficulties": ["easy", "medium", "hard"],
        "instruments": ["guitar", "piano", "violin"],
        "tonalities": ["C", "G", "D", "A", "E", "F", "Am", "Em", "Dm"]
    });
    Ok(api_responce::ApiResponse::new(200, format!("{{{}}}", web::Json(filters))))
}

#[post("/work/pieces")]
pub async fn find_pieces(   
    app_state: web::Data<app_state::AppState>,
    search_pieces: web::Json<SearchPieces>,) -> Result<ApiResponse,ApiResponse> {
             let result = json!({
        "message": "Функция поиска",  // 7. Сообщение для отладки
        "params_received": {  // 8. Возвращаем полученные параметры обратно
            "difficulty": search_pieces.difficulty,  // 9. Доступ к полю структуры
            "instrument": search_pieces.instrument,
            "tonality": search_pieces.tonality
        },
        "pieces": []  // 10. Пока пустой массив (заглушка)
    });
     Ok(ApiResponse::new(200, result.to_string()))
}
