/* eslint-env node */

/**
 * Utilitários para as funções serverless da API
 */

/**
 * Valida se a requisição tem os campos obrigatórios
 */
export function validateRequest(req, requiredFields = []) {
  const body = req.body || {};
  const missing = requiredFields.filter(field => !body[field]);

  if (missing.length > 0) {
    return {
      valid: false,
      error: `Campos obrigatórios ausentes: ${missing.join(', ')}`
    };
  }

  return { valid: true };
}

/**
 * Envia resposta de sucesso padronizada
 */
export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    ...data
  });
}

/**
 * Envia resposta de erro padronizada
 */
export function sendError(res, message, statusCode = 500, details = {}) {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...details
  });
}

/**
 * Middleware para validar método HTTP
 */
export function allowMethods(allowedMethods = ['POST']) {
  return (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      return sendError(res, 'Método não permitido', 405);
    }
    if (next) next();
    return true;
  };
}
