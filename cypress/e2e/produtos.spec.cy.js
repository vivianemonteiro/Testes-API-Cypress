/// <reference types="cypress" />
import contrato from '../contracts/produtos.contract'

describe('Testes da Funcionalidade Produtos', () => {
    let token
    before(() => {
        cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
    });

    it.only('Deve validar contrato de produtos', () => {
        cy.request('produtos').then(response => {
            return contrato.validateAsync(response.body)
        })
    });

    it('Listar todos os produtos', () => {
        cy.request({
            method: 'GET',
            url: 'produtos'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('produtos')
            expect(response.duration).to.be.lessThan(15)
        })

    });

    it('Cadastrar produto', () => {
        const random = Math.floor(Math.random() * 100000);
        let produto = 'Produto Teste ' + random
        cy.cadastrarProduto(token, produto, 870, "Produto Novo de Teste", 450)
            .then((response) => {
                expect(response.status).to.equal(201)
                expect(response.body.message).to.equal('Cadastro realizado com sucesso')
            })
    });

    it('Cadastrar produto já existente', () => {
        cy.cadastrarProduto(token, "Logitech MX Vertical", 470, "Mouse", 382)
            .then((response) => {
                expect(response.status).to.equal(400)
                expect(response.body.message).to.equal('Já existe produto com esse nome')
            })
    });

    it('Deve editar um produto já cadastrado', () => {
        cy.request('produtos').then(response => {
            let id = response.body.produtos[0]._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": "Teste Edição de Produto",
                    "preco": 100,
                    "descricao": "Produto Editado",
                    "quantidade": 100
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
    });

    it('Deve editar um produto cadastrado previamente', () => {
        const random = Math.floor(Math.random() * 100000);
        let produto = 'Produto Teste ' + random
        cy.cadastrarProduto(token, produto, 250, "Descrição do Produto Novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'PUT',
                url: `produtos/${id}`,
                headers: { authorization: token },
                body: {
                    "nome": produto,
                    "preco": 200,
                    "descricao": "Produto Editado",
                    "quantidade": 300
                }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
                
        })
        
    });

    it('Deve deletar um produto cadastrado', () => {
        const random = Math.floor(Math.random() * 100000);
        let produto = 'Produto Teste ' + random
        cy.cadastrarProduto(token, produto, 250, "Descrição do Produto Novo", 180)
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `produtos/${id}`,
                headers: { authorization: token }
            }).then((response) => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Registro excluído com sucesso')
            })
                
        })
        
    });

})

