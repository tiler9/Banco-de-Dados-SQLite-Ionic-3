import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

const DATABSE_FILE_NAME: string = "data.db";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	private db: SQLiteObject;
	nome: string;
	numero: number;
	nomeAProcurar: string;
	itens: any = [];
	situacao: string;

  constructor(public navCtrl: NavController, private sqlite: SQLite) {
  	this.createDatabaseFile();
  }


  createDatabaseFile(){
  	this.sqlite.create({
	  name: DATABSE_FILE_NAME,
	  location: 'default'
	})
	  .then((db: SQLiteObject) => {
	  	console.log('Banco Criado');
	  	this.situacao = "Banco Criado!";
 	   	this.db = db;
	   	this.createTables();
	  })
	  .catch(e => console.log(e));
	}

  createTables(){
		this.db.executeSql('CREATE TABLE IF NOT EXISTS tabela1(nome TEXT, numero INTEGER)', {})
	      .then(() => this.situacao = 'Tabela Criada')
	      .catch(e => this.situacao = e);
	}

	inserir(){
		this.db.executeSql('INSERT INTO tabela1 (nome,numero) VALUES (\'' + this.nome + '\', \''+ this.numero + '\')',{})
		.then(() => this.situacao = 'Nome: ' + this.nome + 'Número: ' + this.numero + 'inseridos.')
		.catch(e => this.situacao = e);
	}

	listar(){
		this.itens = [];
		this.db.executeSql("SELECT * FROM tabela1",{}).then((data)=>{
			if(data == null){
				return;
			} 
			if(data.rows.length > 0){
				for(var i=0; i < data.rows.length; i++){
					this.itens.push({nome: data.rows.item(i).nome,
									numero: data.rows.item(i).numero});
				}
			}
		}).catch(erro => this.situacao = 'Erro: ' + erro);
	}

	procurar(){
		this.itens = [];
		this.db.executeSql('SELECT * FROM tabela1 WHERE nome LIKE (\'%'+ this.nomeAProcurar + '%\')',{}).then((data)=>{
			if(data == null){
				return;
			} 
			if(data.rows.length > 0){
				for(var i=0; i < data.rows.length; i++){
					this.itens.push({nome: data.rows.item(i).nome,
									numero: data.rows.item(i).numero});
				}
			}
		}).catch(erro => this.situacao = 'Erro: ' + erro);
	}

	deletar(){
		this.db.executeSql('DELETE FROM tabela1 WHERE nome = (\'' + this.nomeAProcurar + '\')', {})
			.then(() => this.situacao = 'Nome: ' + this.nome + '  Número: ' + this.numero + ' apagados.')
		.catch(e => this.situacao = e);
	}
}
