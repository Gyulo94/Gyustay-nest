import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { constants } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class SchedulerConfig {
  constructor(private readonly logger: Logger) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.log('임시 파일 정리 스케줄 시작...');
    const uploadTempDir = path.join(process.cwd(), 'uploads', 'temp');
    try {
      try {
        await fs.access(uploadTempDir, constants.F_OK);
      } catch (error) {
        this.logger.warn(
          `업로드 임시 디렉토리가 존재하지 않거나 접근할 수 없습니다: ${uploadTempDir}`,
        );
        return;
      }
      const files = await fs.readdir(uploadTempDir);
      if (files.length === 0) {
        this.logger.log('삭제할 임시 파일이 없습니다.');
        return;
      }
      this.logger.log(
        `${files.length}개의 임시 파일을 찾았습니다. 삭제를 시작합니다.`,
      );
      for (const file of files) {
        const filePath = path.join(uploadTempDir, file);
        try {
          const stats = await fs.stat(filePath);
          if (stats.isFile()) {
            await fs.unlink(filePath);
            this.logger.log(`파일 삭제 성공: ${filePath}`);
          } else {
            this.logger.log(`경로가 파일이 아닙니다. 건너뜝니다: ${filePath}`);
          }
        } catch (error) {
          this.logger.error(`파일 삭제 실패: ${filePath}`, error);
        }
      }
      this.logger.log('임시 파일 정리 스케줄 완료.');
    } catch (error) {
      this.logger.error('임시 파일 정리 중 오류 발생:', error);
    }
  }
}
