import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import styles from './Post.module.css';

import { Comment } from './Comment';
import { Avatar } from './Avatar';

interface Author{
    avatarUrl: string;
    name: string;
    role: string;
}

interface Content{
    type: "link" | "paragraph";
    content: string;
}

export interface PostType{
    id: number;
    author: Author;
    publishedAt: Date;
    content: Content[];
}

interface PostProps{
    post: PostType;
}

export function Post({ post } : PostProps){
    const [comments, setComments] = useState(['']);
    const [newCommentText, setNewCommentText] = useState('');
    const isNewCommentEmpty = newCommentText.length === 0;

    const publishedDateFormated = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR
    });

    const publishedDateDistanceToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true
    });

    function handleCommentInvalid(event : InvalidEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity("Este campo é obrigatório!");
    }

    function handleCommentTextChange(event: ChangeEvent<HTMLTextAreaElement>){
        event.target.setCustomValidity("");

        setNewCommentText(event.target.value);
    }

    function handleCreateNewComment(event: FormEvent){
        event.preventDefault();

        setComments([...comments, newCommentText]);
        setNewCommentText('');
    }

    function deleteComment(commentToDelete: string){
        const commentsWithoutDeletedOne = comments.filter(comment => {
            return comment !== commentToDelete
        });

        setComments(commentsWithoutDeletedOne);
    }

    return(
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={ post.author.avatarUrl } />
                    <div className={styles.authorInfo}>
                        <strong>{ post.author.name }</strong>
                        <span>{ post.author.role }</span>
                    </div>
                </div>
                <time title={publishedDateFormated} dateTime="2023-08-03 20:40">{ publishedDateDistanceToNow }</time>
            </header>
            <div className={styles.content}>

                {post.content.map(line => {
                    if(line.type === "paragraph"){
                        return <p key={line.content}>{line.content}</p>
                    }
                    else if (line.type === "link"){
                        return <p key={line.content}><a href="#">{line.content}</a></p>
                    }
                })}
            </div>

            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>
                <textarea
                    value={newCommentText}
                    onChange={handleCommentTextChange}
                    onInvalid={handleCommentInvalid}
                    placeholder="Escreva um comentário..."
                    required
                />
                <footer>
                    <button type="submit" disabled={isNewCommentEmpty}>
                        Comentar
                    </button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment
                            key={comment} 
                            content={comment}
                            onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    );
}