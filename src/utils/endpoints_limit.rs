//! ограничение обращения к эндпоинту
use chrono::{Duration, Utc};
use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};


pub async fn limitation_generate_code(
    db: &DatabaseConnection,
    email: &str
) -> bool {

    let now = Utc::now().naive_utc();

    // Ищем единственную запись по email (всегда одна)
    match entity::password_resets::Entity::find()
        .filter(entity::password_resets::Column::Email.eq(email))
        .one(db)
        .await
    {
        Ok(Some(record)) => {

            now >= record.create_date + Duration::seconds(60) //|| now >= record.create_date + Duration::seconds(300)
        },
        Ok(None) => {
            println!("Записи не существует");
            true
        },
        Err(err) => {
            println!("Ошибка при проверке ограничений: {}", err);
            false
        }
    }
}







