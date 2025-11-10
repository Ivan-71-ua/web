import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import css from './Landing.module.css'

const faqData = [
  {
    q: 'Чи безпечно зберігати фінансові дані у Clario?',
    a: 'Так. Ми не вимагаємо даних банківських карток. Усі ваші записи зберігаються в захищеній базі даних, і ви самі вирішуєте, яку інформацію вводити.',
  },
  {
    q: 'Clario — це безкоштовно?',
    a: 'Так, базовий функціонал безкоштовний. Ми плануємо додати преміум-функції у майбутньому.',
  },
  {
    q: 'Як працюють “фінансові цілі”?',
    a: 'Ви створюєте ціль, задаєте суму й дедлайн. Clario допоможе відстежувати прогрес.',
  },
  {
    q: 'Чим Clario відрізняється від інших трекерів?',
    a: 'Ми додали гейміфікацію, передбачення та зручну аналітику — не просто таблиці.',
  },
  {
    q: 'А якщо я забуду про цілі?',
    a: 'Clario нагадає й покаже прогрес у наочній формі.',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const goToAuth = () => navigate('/auth')

  return (
    <>
      <section className={css.hero}>
        <img src="/logo.png" alt="Clario" className={css.brand} />
        <h1 className={css.title}>Прозорість твоїх фінансів</h1>
        <p className={css.lead}>
          Керуйте цілями, відстежуйте прогрес і отримуйте рекомендації аби досягти фінансового
          успіху
        </p>
        <button className={css.cta} onClick={goToAuth}>
          Розпочнемо!
        </button>
      </section>

      <section className={css.features}>
        <div className={css.container}>
          <div className={css.row}>
            <img src="/feat-gamify.png" alt="" className={css.ill} width={551} height={555} />
            <div className={css.card}>
              <p className={css.cardText}>
                Перетвори фінанси на гру — отримуй бейджі, відкривай досягнення і реалізуй свої
                фінансові цілі.
              </p>
            </div>
          </div>

          <div className={`${css.row} ${css.reverse}`}>
            <div className={css.card}>
              <p className={css.cardText}>
                Створюй власні цілі! Clario допоможе крок за кроком відстежувати прогрес і
                мотивуватиме не зупинятись.
              </p>
            </div>
            <img src="/feat-goals.png" alt="" className={css.ill} width={551} height={555} />
          </div>

          <div className={css.row}>
            <img src="/feat-sync.png" alt="" className={css.ill} width={551} height={555} />
            <div className={css.card}>
              <p className={css.cardText}>
                Синхронізуй витрати та доходи з календарем, щоб бачити повну картину.
              </p>
            </div>
          </div>

          <div className={`${css.row} ${css.reverse}`}>
            <div className={css.card}>
              <p className={css.cardText}>
                Clario AI аналізує твої фінансові звички та дає персональні поради.
              </p>
            </div>
            <img src="/feat-ai.png" alt="" className={css.ill} width={551} height={555} />
          </div>
        </div>
      </section>

      <section className={css.founders}>
        <div className={css.foundersCta}>
          <button className={css.ctaSm} onClick={goToAuth}>
            Створити акаунт прямо зараз!
          </button>
        </div>
        <h2 className={css.foundersTitle}>Наші засновники</h2>
        <div className={css.foundersGrid}>
          <article className={css.founderCard}>
            <div className={css.frameOuter}>
              <div className={css.frameInner}>
                <img src="/founder-1.png" alt="Сергій Мурченко" className={css.founderImg} />
              </div>
            </div>
            <h3 className={css.founderName}>Сергій Мурченко</h3>
            <p className={css.founderDesc}>
              Відповідає за стиль, колір і настрій. Має колекцію 12 чашок з цитатами.
            </p>
          </article>

          <article className={css.founderCard}>
            <div className={css.frameOuter}>
              <div className={css.frameInner}>
                <img src="/founder-2.png" alt="Петро Кітман" className={css.founderImg} />
              </div>
            </div>
            <h3 className={css.founderName}>Петро Кітман</h3>
            <p className={css.founderDesc}>
              Веде команду до стабільності та чистого UI. “Інновації не мурчать самі”.
            </p>
          </article>

          <article className={css.founderCard}>
            <div className={css.frameOuter}>
              <div className={css.frameInner}>
                <img src="/founder-3.png" alt="Олег Хвіст" className={css.founderImg} />
              </div>
            </div>
            <h3 className={css.founderName}>Олег Хвіст</h3>
            <p className={css.founderDesc}>
              Розробляє фінансові моделі Clario та вірить, що цифри мають серце.
            </p>
          </article>
        </div>
      </section>

      <section className={css.faq}>
        <h2 className={css.faqTitle}>Поширені запитання</h2>
        <div className={css.faqList}>
          {faqData.map((item, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={item.q} className={css.faqCard}>
                <div className={css.faqHeader}>
                  <div className={css.faqQ}>{item.q}</div>
                  <button
                    className={css.faqPlus}
                    aria-label="Детальніше"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <svg viewBox="0 0 50 50" className={isOpen ? css.faqIconOpen : ''}>
                      <path d="M25 50V0" stroke="black" strokeWidth="5" />
                      <line x1="50" y1="24.45" x2="0" y2="24.45" stroke="black" strokeWidth="5" />
                    </svg>
                  </button>
                </div>
                <div className={isOpen ? `${css.faqBody} ${css.faqBodyOpen}` : css.faqBody}>
                  <p className={css.faqAnswer}>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className={css.ctaPanel}>
        <div className={css.ctaInner}>
          <div className={css.ctaText}>
            Менше зайвого.
            <br />
            Більше Clario!
          </div>
          <div className={css.ctaEmblem} role="img" aria-label="Clario emblem">
            <img src="/emblem.png" alt="" />
          </div>
          <button className={css.ctaBig} onClick={goToAuth}>
            Створити акаунт прямо зараз!
          </button>
        </div>
      </section>
    </>
  )
}
