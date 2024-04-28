const insertComment = (params) => {
    const content = params.content
    const postId = params.post_id
    const userId = params.user_id

    return `
        INSERT INTO tb_comments(
            content,
            created_at,
            tb_posts_pid,
            tb_users_pid
        ) 
        VALUE (
            '${content}', 
            CURRENT_TIMESTAMP(), 
            ${postId}, 
            ${userId}
        );
    `
}
const selectComments = (params) => {
    const postId = params.post_id;
    return `
        SELECT 
            TbComments.pid AS comment_id, 
            TbComments.content, 
            TbComments.created_at, 
            TbPosts.pid AS post_id, 
            TbUsers.pid AS user_id, 
            TbUsers.user_name
        FROM 
            tb_comments TbComments INNER JOIN 
            tb_posts TbPosts ON TbComments.tb_posts_pid = TbPosts.pid INNER JOIN 
            tb_users TbUsers ON TbComments.tb_users_pid = TbUsers.pid
        WHERE 
            TbPosts.pid = ${postId}
        ORDER BY TbComments.pid DESC
        LIMIT 5
    `;
}
const deleteComment = (params) => {
    const commentId = params.comment_id;
    const postId = params.post_id
    const userId = params.user_id
    return `
        DELETE FROM tb_comments 
        WHERE 
            pid = ${commentId} AND
            tb_posts_pid = ${postId} AND 
            tb_users_pid = ${userId};       
    `;
}

module.exports = {
    insertComment,
    selectComments,
    deleteComment
}