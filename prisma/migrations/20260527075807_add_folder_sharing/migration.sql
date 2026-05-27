-- CreateTable
CREATE TABLE "sharedFolder" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sharedFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sharedFolder_token_key" ON "sharedFolder"("token");

-- AddForeignKey
ALTER TABLE "sharedFolder" ADD CONSTRAINT "sharedFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
