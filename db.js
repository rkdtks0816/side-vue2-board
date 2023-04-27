const mysql = require('mysql');

const pool = mysql.createPool({
    host:'59.3.14.15',
    user:'root',
    password:'1234',
    port:8006,
    database:'board_db',
    dateStrings: 'date'
})

const query = (con, sql)=>{
    return new Promise((resolve, reject)=>{
        con.query(sql, (conErr, result)=>{            
            if(conErr){
                reject(conErr)
            }else{
                resolve(result)
            }
        })
    })
}

const getConnection = ()=>{
    return new Promise((resolve, reject)=>{
        pool.getConnection((err, con)=>{            
            if(err) {
                console.log("error : ", err)
                con.release()
                reject(err)
            }
            else{
                resolve(con)
            }
        })
    })
}

const beginTransaction = (con)=>{
    return new Promise((resolve, reject)=>{
        con.beginTransaction((err)=>{
            if(err) reject(err)
            else resolve()
        })
    })
}

const rollback = (con) =>{
    return new Promise((resolve, reject)=>{        
        con.rollback((err)=>{
            if(err) reject(err)
            else resolve()
        })
    })
}

const commit = (con) =>{
    return new Promise((resolve, reject)=>{
        con.commit((err)=>{
            if(err) {
                reject(err)
            }
            else resolve()
        })
    })
}

module.exports = {
    query,
    getConnection,
    beginTransaction,
    commit,
    rollback
}