const insertUser = (params) => {
    const userName = params.user_name;
    const loginId = params.login_id;
    const loginPwd = params.login_pwd;

    return `
        INSERT INTO tb_users(
            user_name,
            login_id,
            login_pwd,
            created_at
        ) 
        VALUES (
            '${userName}', 
            '${loginId}', 
            '${loginPwd}', 
            CURRENT_TIMESTAMP()
        );
    `
}

const selectUser = (params) => {
    const loginId = params.login_id;
    const loginPwd = params.login_pwd;

    return `
        SELECT 
            pid AS user_id,
            user_name
        FROM tb_users 
        WHERE 
            login_id = '${loginId}' AND 
            login_pwd = '${loginPwd}';
    `
}

const deleteUser = (params) => {
    const userId = params.user_id;

    return `
        DELETE FROM tb_users 
        WHERE pid = ${userId};
    `
}

module.exports = {
    insertUser,
    selectUser,
    deleteUser
}