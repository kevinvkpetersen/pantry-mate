const required = (name: string) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};

const config = {
    API_PORT: Number(process.env.API_PORT ?? 3000),
    DATABASE_URL: `postgres://${required('POSTGRES_USER')}:${required('POSTGRES_PASSWORD')}@localhost:${required('POSTGRES_PORT')}/${required('POSTGRES_DB')}`,
};

export default config;
