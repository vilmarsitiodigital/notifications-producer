import {} from 'dotenv/config';
import { Kafka } from 'kafkajs';
import { randomUUID } from 'node:crypto';

async function bootstrap() {
  const kafka = new Kafka({
    clientId: 'kafka-producer-ignite-lab',
    brokers: [`${process.env.UPSTASH_KAFKA_BROKER}`],
    sasl: {
      mechanism: 'scram-sha-256',
      username: `${process.env.UPSTASH_KAFKA_USERNAME}`,
      password: `${process.env.UPSTASH_KAFKA_PASSWORD}`,
    },
    ssl: true,
  });

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic: 'notifications.send-notification',
    messages: [
      {
        value: JSON.stringify({
          content: 'Nova solicitação de amizade!',
          category: 'social',
          recipientId: randomUUID(),
        }),
      },
    ],
  });

  await producer.disconnect();
}

bootstrap();
