import TextComponent from "../Component/TextComponent";
import styles from "./styles.module.scss";

const ProfileContainer = () => {
  return (
    <section className={styles.profile_section}>
      <header className={styles.profile_header}>
        <TextComponent textType="span" className={styles.profile_eyebrow}>
          Profil
        </TextComponent>

        <TextComponent textType="h1" className={styles.profile_title}>
          Développeur full-stack, porté par le détail, l’idée et l’expérience.
        </TextComponent>

        <TextComponent textType="p" className={styles.profile_subtitle}>
          Je m&apos;appelle Anael, et j&apos;aime concevoir des expériences web à la fois
          propres, utiles et visuellement justes.
        </TextComponent>
      </header>

      <div className={styles.profile_body}>
        <div className={styles.profile_grid}>
          <div className={styles.profile_column}>
            <TextComponent textType="h2" className={styles.profile_column_title}>
              Ce qui m&apos;anime
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              J&apos;aime les projets qui ont une intention claire, une direction
              visuelle forte et une vraie utilité.
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              Je suis attiré par ce qui demande de la précision, de l&apos;observation
              et du détail.
            </TextComponent>
          </div>

          <div className={styles.profile_column}>
            <TextComponent textType="h2" className={styles.profile_column_title}>
              Pourquoi le développement
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              Je suis venu au développement avec l&apos;envie de comprendre comment
              les interfaces prennent vie.
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              Chaque projet devient un terrain d&apos;apprentissage et d&apos;expression.
            </TextComponent>
          </div>
        </div>

        <div className={styles.profile_grid}>
          <div className={styles.profile_column}>
            <TextComponent textType="h2" className={styles.profile_column_title}>
              Pourquoi j&apos;aime ça
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              Construire des expériences qui ont du sens, de la structure et du
              rythme.
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_paragraph}>
              Progresser en permanence, simplifier, affiner, améliorer.
            </TextComponent>
          </div>

          <div className={styles.profile_column}>
            <TextComponent textType="h2" className={styles.profile_column_title}>
              En dehors du code
            </TextComponent>

            <TextComponent textType="p" className={styles.profile_hobbies_text}>
              Photographie, sport, univers artistiques, expériences narratives.
              Ce sont ces influences qui nourrissent ma façon de concevoir.
            </TextComponent>
          </div>
        </div>

        <TextComponent textType="p" className={styles.profile_transition}>
          Et quand l&apos;envie de créer quelque chose de plus ludique arrive...
        </TextComponent>
      </div>
    </section>
  );
};

export default ProfileContainer;