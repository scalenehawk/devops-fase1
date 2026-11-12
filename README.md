# Lista de Tarefas DevOps — Fase 1

Projeto demonstrativo para a disciplina DevOps na Prática. A aplicação é uma lista de tarefas no navegador, com persistência local. O repositório contém código, testes, build, pipeline de CI e infraestrutura como código para hospedagem estática na AWS.

Repositório: https://github.com/scalenehawk/devops-fase1

## Executar e validar

Requisito: Node.js 20 ou superior.

```bash
npm ci
npm run build
npm test
```

Abra `dist/index.html` no navegador. O build copia os arquivos de `src/` para `dist/` e gera `dist/manifest.json` com SHA-256 dos arquivos publicados. A aplicação não depende de pacotes externos nem de um servidor de API.

## Estrutura

- `src/`: interface e regras de tarefas.
- `tests/`: testes automatizados das regras e do build.
- `scripts/build.mjs`: build reproduzível.
- `.github/workflows/ci.yml`: CI em push e pull request.
- `infra/stack.yaml`: bucket privado S3, CloudFront e Origin Access Control.
- `scripts/deploy.sh`: exemplo de publicação após configuração da AWS CLI.

## Plano de integração contínua

Cada push e pull request para `main` executa `npm ci`, `npm test` e `npm run build` em Node.js 20. O build é enviado como artefato do job para inspeção. A publicação AWS é uma etapa separada e manual: o pipeline de CI não contém credenciais nem faz deploy automático.

## Infraestrutura

O CloudFormation cria um bucket S3 com acesso público bloqueado, versionamento e criptografia SSE-S3. Uma distribuição CloudFront entrega os arquivos por HTTPS e recebe acesso restrito ao bucket via Origin Access Control. O template expõe o domínio da distribuição e o nome do bucket. A implantação exige conta AWS, permissões para CloudFormation, S3 e CloudFront, além de custos associados à conta.

## Integração no GitHub

O workflow fica em `.github/workflows/ci.yml`. Consulte a aba **Actions** do repositório para verificar cada execução. O arquivo de build gerado pelo job pode ser baixado na seção de artefatos da execução.

## Publicar na AWS

Após configurar credenciais com permissão adequada e instalar a AWS CLI:

```bash
npm run build
bash scripts/deploy.sh devops-fase1 NOME_UNICO_DO_BUCKET
```

O script cria ou atualiza a stack, consulta o bucket criado e publica `dist/`. A distribuição CloudFront pode levar alguns minutos para propagar alterações.
