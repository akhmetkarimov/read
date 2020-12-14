# Qazaq University

## Описание

Серверная часть сайта read.kz. Которая написиано на framework Django.

## Шаги

> **Передь тем как начать установки и настройки создайте .env файл пример есть в файле .env.example**

## Требования
* Установите python > 3.6

## Установка

```bash
# Установите все необходимые компоненты. с requirements.txt
$ pip3 install -r requirements.txt

# Обязательно! активируйте свой .env файл для запуска проекта
$ source .env

# Сделайте миграцию всех таблиц перед запуском
$ python3 manage.py makemigrations
$ python3 manage.py migrate

# Создайте супер пользователья для Admin Panel
$ python3 manage.py createsuperuser

# Обязательно! создайте public_key и private_key для авторизаций
$ openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
$ openssl rsa -pubout -in private_key.pem -out public_key.pem
$ cat private_key.pem public_key.pem > keys/user_key.pem

# После создания ключей удалите не нужные файлы 
$ rm private_key.pem public_key.pem
```
## Запуск
```bash
# Запустите проект
$ python3 manage.py runserver
```
## Deployment on Ubuntu 

Install Python, Postgres, Nginx, Curl

```bash
$ sudo apt update
$ sudo apt install python-pip python-dev libpq-dev postgresql postgresql-contrib nginx curl
```

Enter Postgres Interface 

```bash
$ sudo -u postgres psql
```

Create Database same as your POSTGERS_DATABASE name in .env file
```psql
postgres=# CREATE DATABASE qazaq_university;
```

Create user and password same as your POSTGERS_USERNAME, POSTGERS_PASSWORD name in .env file
```psql
postgres=# CREATE USER qazaq_university WITH PASSWORD 'qazaq_university';
```

Set settings to your user 
```psql
postgres=# ALTER ROLE qazaq_university SET client_encoding TO 'utf8';
postgres=# ALTER ROLE qazaq_university SET default_transaction_isolation TO 'read committed';
postgres=# ALTER ROLE qazaq_university SET timezone TO 'UTC';
```

Give grant all privileges to your user, for your database. 
```psql
postgres=# GRANT ALL PRIVILEGES ON DATABASE qazaq_university TO qazaq_university;
```

After finishing all actions you can quit
```psql
postgres=# \q
```
