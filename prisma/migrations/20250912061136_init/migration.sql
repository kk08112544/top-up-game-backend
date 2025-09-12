-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "public"."Package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "public"."Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
