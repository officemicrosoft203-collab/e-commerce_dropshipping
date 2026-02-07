const dropiService = require("../services/dropiService");

// 🔥 IMPORTAR PRODUTOS DA DROPI
exports.importFromDropi = async (req, res) => {
    try {
        console.log('\n📥 ========== INICIANDO IMPORTAÇÃO DROPI ==========');
        
        // Testar conexão primeiro
        const testConnection = await dropiService.testConnection();
        if (!testConnection.success) {
            return res.status(400).json({
                success: false,
                error: 'Não foi possível conectar à Dropi',
                details: testConnection.error
            });
        }

        console.log('✅ Conexão OK com Dropi');

        // Buscar produtos da Dropi
        const dropiResult = await dropiService.getImportedProducts(100, 0);
        
        if (!dropiResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Erro ao buscar produtos da Dropi',
                details: dropiResult.error
            });
        }

        const productsToImport = dropiResult.data || [];
        console.log(`\n📦 Total de produtos para importar: ${productsToImport.length}`);

        if (productsToImport.length === 0) {
            return res.json({
                success: true,
                message: 'Nenhum produto encontrado na Dropi',
                imported: 0,
                updated: 0,
                errors: 0
            });
        }

        let successCount = 0;
        let updateCount = 0;
        let errorCount = 0;
        const importedProducts = [];

        // Importar cada produto
        for (const dropiProduct of productsToImport) {
            try {
                const formattedProduct = dropiService.formatProductData(dropiProduct);
                
                // Verificar se já existe
                db.get(
                    "SELECT id FROM products WHERE dropi_id = ?",
                    [formattedProduct.dropi_id],
                    (err, existing) => {
                        if (err) {
                            console.error(`❌ Erro ao verificar produto ${formattedProduct.name}:`, err);
                            errorCount++;
                            return;
                        }

                        if (existing) {
                            // ✏️ ATUALIZAR EXISTENTE
                            db.run(
                                `UPDATE products SET 
                                    name=?, price=?, cost=?, description=?, stock=?, 
                                    image_url=?, sku=?, category=?, supplier=?, 
                                    supplier_id=?, updated_at=? 
                                WHERE dropi_id=?`,
                                [
                                    formattedProduct.name,
                                    formattedProduct.price,
                                    formattedProduct.cost,
                                    formattedProduct.description,
                                    formattedProduct.stock,
                                    formattedProduct.image_url,
                                    formattedProduct.sku,
                                    formattedProduct.category,
                                    formattedProduct.supplier,
                                    formattedProduct.supplier_id,
                                    new Date(),
                                    formattedProduct.dropi_id
                                ],
                                (err) => {
                                    if (err) {
                                        console.error(`❌ Erro ao atualizar ${formattedProduct.name}:`, err);
                                        errorCount++;
                                    } else {
                                        console.log(`♻️ Atualizado: ${formattedProduct.name} (ID: ${existing.id})`);
                                        updateCount++;
                                    }
                                }
                            );
                        } else {
                            // ➕ INSERIR NOVO
                            db.run(
                                `INSERT INTO products 
                                (dropi_id, name, price, cost, description, stock, image_url, sku, category, supplier, supplier_id, dropi_imported, created_at, updated_at)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
                                [
                                    formattedProduct.dropi_id,
                                    formattedProduct.name,
                                    formattedProduct.price,
                                    formattedProduct.cost,
                                    formattedProduct.description,
                                    formattedProduct.stock,
                                    formattedProduct.image_url,
                                    formattedProduct.sku,
                                    formattedProduct.category,
                                    formattedProduct.supplier,
                                    formattedProduct.supplier_id,
                                    new Date(),
                                    new Date()
                                ],
                                (err) => {
                                    if (err) {
                                        console.error(`❌ Erro ao inserir ${formattedProduct.name}:`, err);
                                        errorCount++;
                                    } else {
                                        console.log(`✨ Importado: ${formattedProduct.name}`);
                                        successCount++;
                                    }
                                }
                            );
                        }
                    }
                );

                importedProducts.push({
                    name: formattedProduct.name,
                    price: formattedProduct.price,
                    stock: formattedProduct.stock,
                    category: formattedProduct.category
                });

            } catch (error) {
                errorCount++;
                console.error('❌ Erro ao processar produto:', error.message);
            }
        }

        console.log('\n✅ ========== IMPORTAÇÃO CONCLUÍDA ==========');
        console.log(`📊 Novos: ${successCount} | Atualizados: ${updateCount} | Erros: ${errorCount}\n`);

        res.json({
            success: true,
            message: 'Importação de produtos Dropi concluída!',
            imported: successCount,
            updated: updateCount,
            errors: errorCount,
            total: productsToImport.length,
            preview: importedProducts.slice(0, 5)
        });

    } catch (error) {
        console.error('❌ ERRO GERAL NA IMPORTAÇÃO:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao importar produtos',
            details: error.message
        });
    }
};

// 🔐 TESTAR CONEXÃO DROPI
exports.testDropiConnection = async (req, res) => {
    try {
        const result = await dropiService.testConnection();
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Conexão com Dropi estabelecida com sucesso!',
                account: result.account
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Não foi possível conectar à Dropi',
                details: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao testar conexão',
            details: error.message
        });
    }
};

// 📊 LISTAR PRODUTOS IMPORTADOS (SÓ DROPI)
exports.listDropiProducts = (req, res) => {
    db.all(
        "SELECT * FROM products WHERE dropi_imported = 1 ORDER BY updated_at DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Erro ao listar produtos'
                });
            }

            res.json({
                success: true,
                count: rows.length,
                products: rows
            });
        }
    );
};
const dropiService = require("../services/dropiService");

// 🔥 IMPORTAR PRODUTOS DA DROPI
exports.importFromDropi = async (req, res) => {
    try {
        console.log('\n📥 ========== INICIANDO IMPORTAÇÃO DROPI ==========');
        
        // Testar conexão primeiro
        const testConnection = await dropiService.testConnection();
        if (!testConnection.success) {
            return res.status(400).json({
                success: false,
                error: 'Não foi possível conectar à Dropi',
                details: testConnection.error
            });
        }

        console.log('✅ Conexão OK com Dropi');

        // Buscar produtos da Dropi
        const dropiResult = await dropiService.getImportedProducts(100, 0);
        
        if (!dropiResult.success) {
            return res.status(400).json({
                success: false,
                error: 'Erro ao buscar produtos da Dropi',
                details: dropiResult.error
            });
        }

        const productsToImport = dropiResult.data || [];
        console.log(`\n📦 Total de produtos para importar: ${productsToImport.length}`);

        if (productsToImport.length === 0) {
            return res.json({
                success: true,
                message: 'Nenhum produto encontrado na Dropi',
                imported: 0,
                updated: 0,
                errors: 0
            });
        }

        let successCount = 0;
        let updateCount = 0;
        let errorCount = 0;

        // Importar cada produto
        for (const dropiProduct of productsToImport) {
            try {
                const formattedProduct = dropiService.formatProductData(dropiProduct);
                
                // Verificar se já existe
                db.get(
                    "SELECT id FROM products WHERE dropi_id = ?",
                    [formattedProduct.dropi_id],
                    (err, existing) => {
                        if (err) {
                            console.error(`❌ Erro ao verificar produto ${formattedProduct.name}:`, err);
                            errorCount++;
                            return;
                        }

                        if (existing) {
                            // ✏️ ATUALIZAR EXISTENTE
                            db.run(
                                `UPDATE products SET 
                                    name=?, price=?, cost=?, description=?, stock=?, 
                                    image_url=?, sku=?, category=?, supplier=?, 
                                    supplier_id=?, updated_at=? 
                                WHERE dropi_id=?`,
                                [
                                    formattedProduct.name,
                                    formattedProduct.price,
                                    formattedProduct.cost,
                                    formattedProduct.description,
                                    formattedProduct.stock,
                                    formattedProduct.image_url,
                                    formattedProduct.sku,
                                    formattedProduct.category,
                                    formattedProduct.supplier,
                                    formattedProduct.supplier_id,
                                    new Date(),
                                    formattedProduct.dropi_id
                                ],
                                (err) => {
                                    if (err) {
                                        console.error(`❌ Erro ao atualizar ${formattedProduct.name}:`, err);
                                        errorCount++;
                                    } else {
                                        console.log(`♻️ Atualizado: ${formattedProduct.name}`);
                                        updateCount++;
                                    }
                                }
                            );
                        } else {
                            // ➕ INSERIR NOVO
                            db.run(
                                `INSERT INTO products 
                                (dropi_id, name, price, cost, description, stock, image_url, sku, category, supplier, supplier_id, dropi_imported, created_at, updated_at)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
                                [
                                    formattedProduct.dropi_id,
                                    formattedProduct.name,
                                    formattedProduct.price,
                                    formattedProduct.cost,
                                    formattedProduct.description,
                                    formattedProduct.stock,
                                    formattedProduct.image_url,
                                    formattedProduct.sku,
                                    formattedProduct.category,
                                    formattedProduct.supplier,
                                    formattedProduct.supplier_id,
                                    new Date(),
                                    new Date()
                                ],
                                (err) => {
                                    if (err) {
                                        console.error(`❌ Erro ao inserir ${formattedProduct.name}:`, err);
                                        errorCount++;
                                    } else {
                                        console.log(`✨ Importado: ${formattedProduct.name}`);
                                        successCount++;
                                    }
                                }
                            );
                        }
                    }
                );

            } catch (error) {
                errorCount++;
                console.error('❌ Erro ao processar produto:', error.message);
            }
        }

        console.log('\n✅ ========== IMPORTAÇÃO CONCLUÍDA ==========\n');

        res.json({
            success: true,
            message: 'Importação de produtos Dropi concluída!',
            imported: successCount,
            updated: updateCount,
            errors: errorCount,
            total: productsToImport.length
        });

    } catch (error) {
        console.error('❌ ERRO GERAL NA IMPORTAÇÃO:', error);
        res.status(500).json({
            success: false,
            error: 'Erro ao importar produtos',
            details: error.message
        });
    }
};