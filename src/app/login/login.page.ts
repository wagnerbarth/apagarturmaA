import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// adicionar módulos
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // variaveis
  usuario: string;
  senha: string;

  constructor(
    private sqLite: SQLite,
    private router: Router
  ) {
    this.usuario = 'admin';
    this.senha = '123';
  }

  ngOnInit() {
    this.criarDB(); // criar ou abre o banco de dados no ciclo de vida inicial do app
  }

  // método para criar a base de dados
  // sqLite.create() - serve teanto para criar como para abrir
  criarDB() {
    this.sqLite.create({ // serve tanto para criar quanto para abrir a base de dados
      name: 'turmaA.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => { // obj db permite execução de métodos do sqLite
        // criar uma constante sql com a query para criar a tabela
        const sql = 'CREATE TABLE IF NOT EXISTS usuarios(' +
          'id INTEGER PRIMARY KEY,' +
          'usuario TEXT UNIQUE NOT NULL,' +
          'email TEXT UNIQUE NOT NULL,' +
          'senha TEXT NOT NULL)';

        // executar a query de criação de tabela
        db.executeSql(sql, [])
          .then(() => { // sempre será executada ao abrir a aplicação
            alert('Tabela usuarios Ok!');

            // testar se o usuário admin padrão já existe no banco
            const sqlSelect = 'SELECT * FROM usuarios WHERE usuario = "admin"';

            // executar a query de pesquisa de usuário admin padrão
            db.executeSql(sqlSelect, [])
              .then((result) => {
                // usar um count de registros para testar result.rows.length
                if (result.rows.length < 1) {
                  // inserir o usuário padrão admin
                  const sqlInsert = 'INSERT INTO usuarios (usuario, email, senha) VALUES (?,?,?)';

                  // configurar os dados a serem inseridos no banco
                  const dadosUsuario = ['admin', 'admin@admin.com', '123'];

                  // executar a query para inserir os dados do usuário admin
                  db.executeSql(sqlInsert, dadosUsuario).then(() => { alert('Usuário admin OK!'); });
                }
              });
          })
          .catch(() => {
            alert('Tabela usuarios Erro!');
          });
      })
      .catch((err) => {
        alert('Create Database Error!');
      });
  }

  /* --------------------------------------
  * Método de Login
  * recebe 2 parâmetros:
  *   usuario do tipo string
  *   senha do tipo string
  -----------------------------------------*/
  login(usuario: string, senha: string) {

    // preparar os dados do usuario
    const dadosUsuario = [
      usuario,
      senha
    ];

    // abrir o banco de dados
    this.sqLite.create({ // serve tanto para criar quanto para abrir a base de dados
      name: 'turmaA.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        // prepared statement query
        const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND senha = ?';

        db.executeSql(sql, dadosUsuario)
          .then((result) => {
            // console.log('login: ', result); debug
            const login = result.rows.length;
            if(login === 1){
              alert('Login OK');
              // redireciona para páginas do crud
              this.router.navigateByUrl('/crud');
            } else {
              alert('Deu ruim....');
            }
          });
      });
  }

}
