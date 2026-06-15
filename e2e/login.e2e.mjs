/**
 * Test End-to-End (Selenium WebDriver) — Parcours de connexion administrateur.
 *
 * Ce test vérifie un vrai parcours utilisateur sur l'application buildée, sans
 * dépendre du backend :
 *   1. Un visiteur non authentifié est redirigé vers /login (garde de route).
 *   2. La page de connexion s'affiche correctement.
 *   3. La validation côté client bloque un formulaire vide / un email invalide.
 *   4. La soumission avec des identifiants valides déclenche bien l'appel réseau
 *      (sans backend joignable, l'erreur réseau attendue s'affiche).
 *
 * Lancement local : `npm run preview` puis `npm run test:e2e`
 * En CI : voir .github/workflows/ci.yml
 */
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert/strict";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:4173";
const TIMEOUT = 10_000;

async function run() {
  const options = new chrome.Options()
    .addArguments("--headless=new")
    .addArguments("--no-sandbox")
    .addArguments("--disable-dev-shm-usage")
    .addArguments("--window-size=1280,800");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    // 1. La garde de route redirige le visiteur anonyme vers /login
    await driver.get(`${BASE_URL}/`);
    await driver.wait(until.urlContains("/login"), TIMEOUT);
    console.log("✓ Redirection vers /login pour un visiteur non authentifié");

    // 2. La page de connexion est bien rendue
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(., 'Espace administrateur')]")),
      TIMEOUT
    );
    console.log("✓ Page de connexion affichée");

    // 3a. Soumission d'un formulaire vide => erreurs de validation client
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await submitBtn.click();
    await driver.wait(
      until.elementLocated(
        By.xpath("//p[contains(@class,'text-destructive') and contains(., 'Mot de passe requis')]")
      ),
      TIMEOUT
    );
    console.log("✓ Validation : formulaire vide refusé (mot de passe requis)");

    // 3b. Email invalide => message d'erreur dédié
    const emailInput = await driver.findElement(By.id("email"));
    const passwordInput = await driver.findElement(By.id("password"));
    await emailInput.sendKeys("not-an-email");
    await passwordInput.sendKeys("secret123");
    await submitBtn.click();
    await driver.wait(
      until.elementLocated(
        By.xpath("//p[contains(@class,'text-destructive') and contains(., 'Email invalide')]")
      ),
      TIMEOUT
    );
    console.log("✓ Validation : email invalide refusé");

    // 4. Identifiants valides => l'appel réseau part (backend absent => erreur réseau)
    await emailInput.clear();
    await emailInput.sendKeys("admin@example.com");
    await submitBtn.click();
    const networkError = await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(., 'Une erreur est survenue')]")
      ),
      TIMEOUT
    );
    assert.ok(await networkError.isDisplayed());
    console.log("✓ Soumission valide : appel réseau déclenché (erreur réseau attendue affichée)");

    console.log("\n✅ Test E2E de connexion réussi");
  } finally {
    await driver.quit();
  }
}

run().catch((err) => {
  console.error("\n❌ Échec du test E2E :", err.message);
  process.exit(1);
});
