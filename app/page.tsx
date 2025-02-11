// pages/index.tsx
import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Football Prediction</title>
      </Head>

      <main style={styles.container}>
        <h1 style={styles.title}>กิจกรรมทายผลฟุตบอล</h1>
        <p style={styles.subtitle}>
          ลุ้นรางวัลใหญ่กับกิจกรรมสนุก ๆ
        </p>
        <Link href="/games">
          <button style={styles.button}>
            เริ่มทายผล
          </button>
        </Link>
      </main>
    </>
  )
}

export default Home

// ตัวอย่างสไตล์อินไลน์ง่าย ๆ
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    marginBottom: '1rem',
    color: '#666'
  },
  button: {
    padding: '0.8rem 1.2rem',
    fontSize: '1rem',
    cursor: 'pointer'
  }
}