import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import OpenAI from 'openai';
import config from '../config/config';

const openai = new OpenAI({
  apiKey: config.openAiKey
});

const aiPrompt = catchAsync(async (req, res) => {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: `Improve this text keeping the idea: ${req.body.message}` }
    ],
    model: 'gpt-3.5-turbo'
  });

  res.status(httpStatus.OK).send({
    message: completion.choices[0].message.content
  });
});

export default {
  aiPrompt
};
