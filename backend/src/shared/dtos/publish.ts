import Joi from "joi";
import { PUBLISH_STATE } from "../interfaces";

export const publishDto = Joi.object({
  action: [
    Joi.string()
      .required()
      .valid(PUBLISH_STATE.PUBLISH, PUBLISH_STATE.UNPUBLISH),
  ],
  id: [Joi.string().required(), Joi.number().integer().required()],
});
