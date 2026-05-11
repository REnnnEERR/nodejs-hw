import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {

  if (err instanceof Error) {
    return res.status(err.status).json({ message: err.message || err.name });
  };
  res.status(500).json({
    message: `Error 500`,
  });

}
