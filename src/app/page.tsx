import { getAllArticles } from "@/actions/article";
import DeleteButton from "@/components/delete-button";
import MailButton from "@/components/mail-button";

export default async function Page() {
  const articles = await getAllArticles();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {articles.map((article) => (
          <div key={article.id}>
            <p>{article.title}</p>
            <p>{article.content}</p>
            <DeleteButton id={article.id} />
          </div>
        ))}
        <MailButton />
      </main>
    </div>
  );
}
