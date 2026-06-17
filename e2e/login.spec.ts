import { test, expect, type Page } from "@playwright/test";

/**
 * Parcours d'authentification de l'espace administrateur.
 *
 * L'API n'est pas sollicitée réellement : on intercepte les requêtes réseau
 * (page.route) pour simuler chaque réponse du back-end. On teste ainsi les
 * VRAIS comportements de l'application (garde de route, validation, gestion
 * des erreurs, contrôle du rôle) sans dépendre d'un backend déployé.
 */

const ADMIN = {
  id: "u-1",
  email: "admin@cesizen.fr",
  firstname: "Admin",
  lastname: "CESIZen",
  role: "ADMIN",
};

function loginResponse(user: typeof ADMIN) {
  return JSON.stringify({
    success: true,
    data: { accessToken: "header.payload.signature", user },
  });
}

/** Mocke les endpoints du tableau de bord pour qu'il s'affiche sans backend. */
async function stubDashboard(page: Page) {
  for (const path of ["**/users", "**/articles", "**/categories", "**/base-emotions", "**/detailed-emotions"]) {
    await page.route(path, (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ success: true, data: [] }) })
    );
  }
}

test.describe("Connexion administrateur", () => {
  test("redirige un visiteur non authentifié vers /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /Espace administrateur/i })).toBeVisible();
  });

  test("bloque la soumission d'un formulaire vide (validation client)", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.getByText("Mot de passe requis")).toBeVisible();
    // Aucune requête réseau ne doit partir : on reste sur /login
    await expect(page).toHaveURL(/\/login$/);
  });

  test("refuse une adresse email invalide", async ({ page }) => {
    await page.goto("/login");
    // "test@invalid" passe la validation HTML5 native (présence d'un @) mais
    // échoue la validation Zod (domaine invalide) -> message applicatif testé.
    await page.locator("#email").fill("test@invalid");
    await page.locator("#password").fill("secret123");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.getByText("Email invalide")).toBeVisible();
  });

  test("affiche une erreur sur identifiants incorrects (401)", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ success: false, error: "Invalid credentials" }) })
    );
    await page.goto("/login");
    await page.locator("#email").fill("admin@cesizen.fr");
    await page.locator("#password").fill("mauvais-mdp");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.getByText(/Identifiants incorrects/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test("refuse l'accès à un compte non administrateur", async ({ page }) => {
    await page.route("**/auth/login", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: loginResponse({ ...ADMIN, role: "USER" }) })
    );
    await page.goto("/login");
    await page.locator("#email").fill("user@cesizen.fr");
    await page.locator("#password").fill("bon-mdp");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.getByText(/Accès refusé/i)).toBeVisible();
    await expect(page.getByText(/réservé aux administrateurs/i)).toBeVisible();
    // Toujours non authentifié
    await expect(page).toHaveURL(/\/login$/);
  });

  test("connecte un administrateur et ouvre le tableau de bord", async ({ page }) => {
    await stubDashboard(page);
    await page.route("**/auth/login", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: loginResponse(ADMIN) })
    );
    await page.goto("/login");
    await page.locator("#email").fill("admin@cesizen.fr");
    await page.locator("#password").fill("bon-mdp");
    await page.getByRole("button", { name: /Se connecter/i }).click();

    // On quitte la page de login et le tableau de bord s'affiche
    await expect(page).not.toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: /Espace administrateur/i })).toHaveCount(0);
    await expect(page.getByText(/Bonjour|Bon après-midi|Bonsoir/)).toBeVisible();
  });

  test("affiche une erreur en cas d'indisponibilité du serveur", async ({ page }) => {
    await page.route("**/auth/login", (route) => route.abort());
    await page.goto("/login");
    await page.locator("#email").fill("admin@cesizen.fr");
    await page.locator("#password").fill("bon-mdp");
    await page.getByRole("button", { name: /Se connecter/i }).click();
    await expect(page.getByText(/Une erreur est survenue/i)).toBeVisible();
  });
});
