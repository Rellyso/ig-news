import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/client"
import { useRouter } from "next/dist/client/router"
import Head from "next/Head"
import Link from "next/link"
import { RichText } from "prismic-dom"
import { useEffect } from "react"
import { getPrismicClient } from "../../../services/prismic"

import styles from '../post.module.scss'

interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    content: string,
    updatedAt: string,
  }
}


export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter()


  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>

          </div>
        </article>
      </main>
    </>
  )
}


export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'viagem-no-tempo-google-earth-mostra-o-passado-da-terra' } }
    ],
    fallback: 'blocking',  // pode ser true, false e blocking

    // true:
    // - abre e carrega a tela quando o usuário carrega a página
    // - causa layout shift. Quebra de layout.
    // - não é bom para SO, pois não indexa o conteúdo não gerado em buscadores
    // false:
    // - retorna 404 para os posts não carregados estaticamente.
    // blocking
    // - Carrega as páginas ainda não geradas estaticamente.
    // - Só mostra a pagina após carregar todo o conteúdo da página
    // - Espera o server side rendering
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params

  const prismic = getPrismicClient()

  const response = await prismic.getByUID('publication', String(slug), {})

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 30, // 30 minutes
  }
}