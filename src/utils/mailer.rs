//! модуль подключения к почте, и создания секретного кода для сброса пароля
use lettre::{ Message, SmtpTransport, Transport, transport::smtp::{ authentication::Credentials} };
use lettre_email::Email; 
use lettre::transport::smtp::client::{Tls, TlsParameters};
use crate::utils::constants::SMTP_PORT;

use super::constants::{SMTP_USERNAME, SMTP_PASSWORD};




pub async fn smtp_full_server() -> Result<(), Box<dyn std::error::Error>>{
    println!("Smpt запускается");
    
    let my_email = SMTP_USERNAME.to_string();
    let my_pass = SMTP_PASSWORD.to_string();
    let recipient = "spodin.art@gmail.com".to_string();
    let my_email1 = SMTP_USERNAME.to_string();


    //удостоверение личности для яндекса
    let credentials = Credentials::new(my_email, my_pass);
    //Настройка TSL
    let tls_parameters = TlsParameters::new("smtp.yandex.ru".to_string())?;
    // Подключение к сервису Smtp
    let mailer = SmtpTransport::relay("smtp.yandex.ru")?
        .credentials(credentials)
        .port(587)
        .authentication(vec![lettre::transport::smtp::authentication::Mechanism::Login])
        .tls(Tls::Required(tls_parameters))
        .build();


    //Письмо
    let email = Message::builder()
    .from(my_email1.parse()?)
    .to(recipient.parse()?)
    .subject("Ебать тебе письмо от Muza пришло")
    .body("А ты сука спишь".to_string())?; 
    //отправка
match mailer.send(&email) {
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
