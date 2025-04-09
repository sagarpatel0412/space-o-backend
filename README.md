# Space Event Backend

This project is a NestJS application that uses Sequelize ORM with MySQL to manage events and their related images. This README will guide you through setting up and running the application.

## Prerequisites

- **Node.js v20** (Ensure you are using Node.js version 20)
- **MySQL Server** (installed and running)
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Create the Database

Before running the migrations, create the database in your MySQL instance. You can do this through your MySQL client or command line.

For example, log in to MySQL and run:

```sql
CREATE DATABASE space_o_backend;
```

Ensure that your MySQL credentials and database name match the ones in your environment configuration.

### 2. Configure Environment Variables

Create a `.env` file in the root of the project (if not already present) and add the following configuration (adjust values if needed):

```dotenv
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=space_o_backend1
MYSQL_USERNAME=root
MYSQL_PASSWORD="root%40123"
PORT=8001
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES=86400
SALT=your_salt_value_here
```

This configuration file is used by the `config.js` file to connect to the MySQL database.

### 3. Install Dependencies

Run the following command to install all required packages:

```bash
npm install
```

### 4. Run Database Migrations

After creating the database and configuring your environment variables, run the migrations to set up your tables:

```bash
npm run migrate
```

This command uses the Sequelize CLI to execute the migrations defined in your project.

### 5. Start the Application

Finally, start the application with:

```bash
npm run start
```

For development mode with hot reloading, you can use:

```bash
npm run start:dev
```

Your application should now be running on the port specified in your `.env` file (default is `8001`).

## Additional Information

- **Migrations & Models:**  
  The project uses Sequelize with a configuration file (`config/config.js`) that loads settings from the `.env` file.

- **Uploading Images:**  
  The project integrates file uploads (using Multer) to handle event images. Uploaded images will be stored in the root folder by default, and associated records are saved in the `event_images` table.

- **API Endpoints:**  
  Refer to the API documentation (or code comments) for details on the available endpoints.

## Troubleshooting

- **MySQL Access Issues:**  
  If you encounter access denied errors, double-check your database credentials in the `.env` file. Ensure the special characters (e.g., `@`) are URL-encoded if needed when using connection URLs. In the JSON config, this is not necessary.

- **Node Version:**  
  Verify you are running Node.js v20 by checking with `node -v`.

- **Migration Errors:**  
  If migrations fail, ensure your database exists and the MySQL server is running. You can also try to run `npx sequelize-cli db:migrate:undo` to revert changes and re-run the migrations.
