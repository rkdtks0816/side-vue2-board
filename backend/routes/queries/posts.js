const insertPost = (params) => {
    const title = params.title
    const content = params.content
    const userId = params.user_id

    return `
        INSERT INTO tb_posts(
            title, 
            content,
            created_at,
            tb_users_pid
        )
        VALUES (
            "${title}",
            "${content}",
            CURRENT_TIMESTAMP(),
            ${userId}
        );
    `
}

const selectPosts = (params) => {
    const pageNum = (params.page_no - 1) * 10;
    return `
        SELECT 
            TbPosts.pid AS post_id, 
            TbPosts.title, 
            TbPosts.created_at,
            TbUsers.pid AS user_id, 
            TbUsers.user_name
        FROM 
            tb_posts TbPosts INNER JOIN 
            tb_users TbUsers ON TbPosts.tb_users_pid = TbUsers.pid
        ORDER BY TbPosts.pid DESC
        LIMIT ${pageNum}, 10;
    `;
}

const countPosts = () => {
    return `
        SELECT 
            count(pid) AS count
        FROM tb_posts
    `;
}

const selectPost = (params) => {
    const postId = params.post_id
    return `
        SELECT 
            TbPosts.pid AS post_id, 
            TbPosts.title, 
            TbPosts.content, 
            TbPosts.created_at, 
            TbUsers.pid AS user_id, 
            TbUsers.user_name 
        FROM 
            tb_posts TbPosts INNER JOIN 
            tb_users TbUsers ON TbPosts.tb_users_pid = TbUsers.pid 
        WHERE TbPosts.pid = ${postId};
    `;
}

const updatePost = (params) => {
    const title = params.title
    const content = params.content
    const postId = params.post_id
    const userId = params.user_id
    return `
        UPDATE tb_posts SET 
            title = '${title}', 
            content = '${content}' 
        WHERE pid = ${postId} AND 
        tb_users_pid = ${userId};  
    `;
}

const deletePost = (params) => {
    const postId = params.post_id
    const userId = params.user_id
    return `
        DELETE FROM tb_posts 
        WHERE 
            pid = ${postId} AND 
            tb_users_pid = ${userId};        
    `;
}

module.exports = {
    insertPost,
    selectPosts,
    countPosts,
    selectPost,
    updatePost,
    deletePost
}