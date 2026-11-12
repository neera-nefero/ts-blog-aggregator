import { User } from "../lib/db/queries/users";
import { getPostsForUser } from "../lib/db/queries/posts";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    const limit = (args[0]) ? parseInt(args[0]) : 2;

    const posts = await getPostsForUser(user.id, limit)

    for (const post of posts) {
        console.log(post.posts.title);
        console.log(post.posts.publishedAt);
        console.log(post.posts.description);
        console.log('----------------')
    }
}