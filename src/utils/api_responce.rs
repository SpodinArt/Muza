use actix_web::{body::{BoxBody}, http::StatusCode, web, HttpResponse, Responder};

pub struct ApiResponce {
    pub status_code: u16,
    pub body: String,
    responce_code: StatusCode
}

impl ApiResponce {
    pub fn new(status_code: u16, body: String) -> Self{
        ApiResponce{
            status_code,
            body,
            responce_code: StatusCode::from_u16(status_code).unwrap()
        }
    }
}

impl Responder for ApiResponce {
    type Body = BoxBody ;

    fn respond_to(self, req: &actix_web::HttpRequest) -> actix_web::HttpResponse<Self::Body> {
        let body = BoxBody::new(web::BytesMut::from(self.body.as_bytes()));
        HttpResponse::new(self.responce_code).set_body(body)
    }
}