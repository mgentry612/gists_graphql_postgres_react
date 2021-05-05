const postgres = require('postgres');
const process = require('process');

let func = async () => {
    let postgres_inst = postgres('postgres://username:password@host:port/database', {
        host        : 'localhost',         // Postgres ip address or domain name
        port        : 5432,       // Postgres server port
        path        : '',         // unix socket path (usually '/tmp')
        database    : 'postgres',         // Name of database to connect to
        username    : 'postgres',         // Username of database user
        password    : 'Pass2020!',         // Password of database user
        ssl         : false,      // True, or options for tls.connect
        max         : 10,         // Max number of connections
        timeout     : 0,          // Idle connection timeout in seconds
    });
    
    try {
        let data = await postgres_inst`
            create database gists
        `;
        console.log(data);
    } catch (e) {
        console.log(e)
    }
    
    
    postgres_inst = postgres('postgres://username:password@host:port/database', {
        host        : 'localhost',         // Postgres ip address or domain name
        port        : 5432,       // Postgres server port
        path        : '',         // unix socket path (usually '/tmp')
        database    : 'gists',         // Name of database to connect to
        username    : 'postgres',         // Username of database user
        password    : 'Pass2020!',         // Password of database user
        ssl         : false,      // True, or options for tls.connect
        max         : 10,         // Max number of connections
        timeout     : 0,          // Idle connection timeout in seconds
    });
    
    try {
        let data = await postgres_inst`
        create table favorites (
            gist_id text primary key
        )
        `;
        console.log(data);
    } catch (e) {
        console.log(e)
    }
    process.exit();
}
func();