//     ╭───────────────────────────────────────────╮
//     │             Copyright (c)                 │
//     │           ────────────────                │
//     │        Avrnos, All Rights Reserved        │
//     ╰───────────────────────────────────────────╯

import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1640000010000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'discordId',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
