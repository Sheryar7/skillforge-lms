type Post = {
  id: number;
  title: string;
  body: string;
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      <div className="space-y-4">
        {posts.slice(0, 10).map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-gray-600">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}