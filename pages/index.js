import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href="/DrawingFeed">
            <a>Drawing Feed</a>
          </Link>
        </li>
        <li>
          <Link href="/Create">
            <a>Create</a>
          </Link>
        </li>
      </ul>
    </div>
  )
}
