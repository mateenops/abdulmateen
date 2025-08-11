export class ChatResponseDto {
  constructor(
    public id: string,
    public question: string,
    public answer: string,
    public tokensUsed: number,
    public createdAt: Date
  ) {}
}
