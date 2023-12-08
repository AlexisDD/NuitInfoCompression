import axios from 'axios';

/**
 * Classe permettant de gérer les requêtes API liées à l'authentification.
 */
class AuthApi {
    /**
     * Méthode permettant d'effectuer une requête API pour se connecter.
     * @param credentials Identifiants de connexion.
     * @returns Les données de l'utilisateur connecté.
     */
    async login(credentials: { email: string, password: string }) {
        return await axios.post('/user/login', {
            email: credentials.email,
            password: credentials.password,
        }).then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));

            return response.data;
        })
        .catch((error) => {
            if (error.response.status === 401) {
                return Promise.reject(new Error("L'adresse email ou le mot de passe est incorrect."));
            } else {
                return Promise.reject(new Error("Une erreur est survenue. Veuillez réessayer plus tard."));
            }
        });
    }

    /**
     * Méthode permettant d'effectuer une requête API pour s'inscrire.
     * @param credentials Identifiants d'inscription.
     * @returns Les données de l'utilisateur connecté.
     */
    async register(credentials: { email: string, password: string, confirmPassword: string }) {
        return axios.post('/user/register', {
            email: credentials.email,
            password: credentials.password,
            confirmPassword: credentials.confirmPassword,
        }).then((response) => {
            localStorage.setItem('user', JSON.stringify(response.data));

            return response.data;
        })
        .catch((error) => {
            if (error.response.status === 400) {
                return Promise.reject(new Error("L'adresse email est déjà utilisée."));
            } else {
                return Promise.reject(new Error("Une erreur est survenue. Veuillez réessayer plus tard."));
            }
        });
    }

    /**
     * Méthode permettant de déconnecter l'utilisateur.
     */
    logout() {
        // On supprime juste le token du localStorage (session).
        localStorage.removeItem('user');
    }
}

export default new AuthApi();