const axios = require('axios');

class DropiService {
    constructor() {
        this.API_URL = 'https://api.dropi.com.br/v1';
        this.API_KEY = process.env.DROPI_API_KEY || '';
        this.ACCOUNT_ID = process.env.DROPI_ACCOUNT_ID || '';
    }

    isConfigured() {
        return !!(this.API_KEY && this.ACCOUNT_ID);
    }

    async getImportedProducts(limit = 50, offset = 0) {
        try {
            if (!this.isConfigured()) {
                throw new Error('Credenciais Dropi não configuradas no .env');
            }

            console.log('🔄 Buscando produtos da Dropi...');
            
            const response = await axios.get(
                `${this.API_URL}/accounts/${this.ACCOUNT_ID}/products`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        limit: limit,
                        offset: offset,
                        status: 'active'
                    },
                    timeout: 10000
                }
            );

            console.log(`✅ ${response.data.data?.length || 0} produtos encontrados na Dropi`);
            
            return {
                success: true,
                data: response.data.data || [],
                total: response.data.total || 0,
                hasMore: response.data.has_more || false
            };
        } catch (error) {
            console.error('❌ Erro ao buscar produtos Dropi:', error.message);
            return {
                success: false,
                error: error.message,
                data: []
            };
        }
    }

    async testConnection() {
        try {
            if (!this.isConfigured()) {
                return {
                    success: false,
                    error: 'Credenciais não configuradas'
                };
            }

            const response = await axios.get(
                `${this.API_URL}/accounts/${this.ACCOUNT_ID}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.API_KEY}`
                    },
                    timeout: 5000
                }
            );

            console.log('✅ Conexão com Dropi OK');
            
            return {
                success: true,
                account: response.data.data
            };
        } catch (error) {
            console.error('❌ Erro ao testar conexão Dropi:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    formatProductData(dropiProduct) {
        const mainImage = dropiProduct.images?.[0]?.url || 
                         dropiProduct.image_url || 
                         dropiProduct.main_image || '';

        return {
            dropi_id: dropiProduct.id || dropiProduct.product_id,
            name: dropiProduct.title || dropiProduct.name || 'Produto sem nome',
            description: dropiProduct.description || dropiProduct.details || '',
            price: parseFloat(dropiProduct.price) || parseFloat(dropiProduct.retail_price) || 0,
            cost: parseFloat(dropiProduct.cost) || parseFloat(dropiProduct.supplier_price) || 0,
            stock: parseInt(dropiProduct.stock) || parseInt(dropiProduct.inventory) || 0,
            image_url: mainImage,
            images: JSON.stringify(dropiProduct.images || []),
            sku: dropiProduct.sku || dropiProduct.code || '',
            category: dropiProduct.category || dropiProduct.category_name || 'Sem categoria',
            supplier: dropiProduct.supplier_name || 'Dropi',
            supplier_id: dropiProduct.supplier_id || '',
            created_at: new Date(),
            updated_at: new Date(),
            dropi_imported: 1
        };
    }
}

module.exports = new DropiService();