//! модуль подключения к почте, и создания секретного кода для сброса пароля
use std::{fs};

use lettre::{ Message, SmtpTransport, Transport, message::header::ContentType, transport::smtp::{ SMTP_PORT, authentication::Credentials} };
use lettre::transport::smtp::client::{Tls, TlsParameters};
use super::constants::{SMTP_USERNAME, SMTP_PASSWORD,SMTP_HOST};



pub struct YandexSmtpConfig {
    pub username: String,
    pub pass: String,
    pub smtp_host: String,
    pub smtp_port: u16
}

impl Default for YandexSmtpConfig {
    fn default() -> Self {
        Self {
            username: SMTP_USERNAME.to_string(),
            pass: SMTP_PASSWORD.to_string(),
            smtp_host: SMTP_HOST.to_string(),
            smtp_port: SMTP_PORT
        }
    }
}

pub struct YandexSmtpClient{
    config: YandexSmtpConfig,
    mailer: SmtpTransport,
}

impl YandexSmtpClient {
    pub async fn new(config: YandexSmtpConfig) -> Result<Self, Box<dyn std::error::Error>> {
        println!("🔧 Создаем Yandex SMTP клиент...");

        if config.username.is_empty() || config.pass.is_empty() {
            return Err("Username или password не могут быть пустыми".into());
        }
    //удостоверение личности для яндекса
    let credentials = Credentials::new(config.username.clone(), config.pass.clone());
    //Настройка TSL
    let tls_parameters = TlsParameters::new("smtp.yandex.ru".to_string())?;
    // Подключение к сервису Smtp
    let mailer = SmtpTransport::relay(&config.smtp_host)?
    .credentials(credentials)
    .port(config.smtp_port)
    .authentication(vec![lettre::transport::smtp::authentication::Mechanism::Login])
    .tls(Tls::Required(tls_parameters))
    .build();
    
    println!("✅ Smtp start");
    Ok(Self {config, mailer})

}
    pub async fn send_email(&self, email: &String, token: String) -> Result<(), Box<dyn std::error::Error>>  {

        let html_content = fs::read_to_string("static/mail.html")?;
        let html_content = html_content
        .replace("{{token}}", &token.to_string());
                        
        let message = Message::builder()
            .to(email.parse()?)
            .from(self.config.username.clone().parse()?)
            .subject("Ваш код подтверждения".to_string())
            .header(ContentType::TEXT_HTML)
            .body(html_content)?;

        match self.mailer.send(&message) {
            Ok(_) => {
                println!("✅ Письмо успешно отправлено!");
                Ok(())
            },
            Err(e) => {
                eprintln!("❌ Ошибка отправки: {}", e);
                Err(Box::new(e))
            }
        }
    }
}
   
    




