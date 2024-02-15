/**
 * @typedef {Object} NewGameMessage
 * @property {string} id
 * @property {Object} questions
 */

/**
 * @typedef {Object} JoinGameMessage
 * @property {"joinGame"} type
 * @property {string} gameID
 * @property {string} playerID
 */

/**
 * @typedef {Object} StartGameMessage
 * @property {"startGame"} type
 * @property {string} gameID
 * @property {string} playerID
 */

/**
 * @typedef {Object} AnswerQuestionMessage
 * @property {"answerQuestion"} type
 * @property {string} gameID
 * @property {string} playerID
 * @property {string} answer
 * @property {?string} additionalAnswer
 */

/**
 * @typedef {Object} UseLifelineMessage
 * @property {"useLifeline"} type
 * @property {string} gameID
 * @property {string} playerID
 * @property {string} lifeline
 */

/**
 * @typedef {Object} ContinueMessage
 * @property {"continue"} type
 * @property {string} gameID
 * @property {string} playerID
 */

/**
 * @typedef {Object} GameStateMessage
 * @property {"gameState"} type
 * @property {string} gameID
 * @property {number} sequence
 * @property {Player[]} players
 * @property {State} state
 */

/**
 * @typedef {Object} RemoveAnswersMessage
 * @property {"removeAnswers"} type
 * @property {string} gameID
 * @property {string} playerID
 * @property {string[]} answers
 */

/**
 * @typedef {Object} PlayerScoresMessage
 * @property {"playerScores"} type
 * @property {string} gameID
 * @property {number[]} scores
 */
