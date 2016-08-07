# Protocolo de Inicialização

Seguir a seguinte ordem para que todos os módulos sejam corretamente inicializados e mapeados.
Note que comandos executados num terminal começam com `$`, enquanto os comandos executados no console do `supervisor`, por sua vez, iniciam com um `supervisor>`. Essas duas informações serão exibidas pelo terminal, indicando qual utilitário você estará usando.

> **Protip**: Antes de executar um comando ou passo, leia as informações contidas nele até o fim, e apenas então execute o comando descrito. Isso deve-se ao fato de que às vezes existem breves comentários sobre o comportamento esperado.

> **Protip**: Tanto o terminal quanto o console do `supervisor` possuem um recurso chamado *autocompletion*. Ele consegue, em vários casos, determinar qual será o comando que você deseja executar e o completa. Para que esse recurso entre em ação, pressione <kbd>tab</kbd> após começar a entrar com um comando ou instrução.

> **Aviso**: O procedimento deve ser iniciado com a energia desligada.

-  Ligar o computador (PC) no cabo **branco** que está pendurado na parede.

-  Ligar o computador (Mac) no cabo **amarelo**, usando o adaptador Thunderbolt.

-  Conectar o USB de captura de som no computador (PC) e ligar o cabo do pessoal do som na entrada **amarela** do USB de captura.

-  Logar no Mac com *a senha que todos sabemos*.

-  Abrir o iTerm (presente no Dock).

-  Executar o seguinte comando:

    ```
    $ ssh d3@192.168.42.10
    ```

-  Pressionar <kbd>Enter</kbd>. Isso conectará o Mac a um terminal do PC.

-  Mudar o diretório usando o seguinte comando:

    ```
    $ cd Desktop/skol-animator
    ```

   > **Protip**: O terminal diferencia maiúsculas e minúsculas.

-  Iniciar o `supervisord` executando o seguinte comando:

    ```
    $ ./start
    ```

    Pressionar <kbd>Enter</kbd>.

-  Entre no console de controle do `supervisor` executando o seguinte comando:

    ```
    $ supervisorctl
    ```

-  Pare todos os processos em execução com o seguinte comando:

    ```
    supervisor> stop all
    ```

-  Inicie o PatchPanel com o seguinte comando:

    ```
    supervisor> start ppv4
    ```

-  Caso não esteja usando duas sessões SSH, digite `exit` seguido de <kbd>Enter</kbd> para sair do console do `supervisor`.

-  Prepare para ler os logs de inicialização dos Gateways usando o seguinte comando:

    ```
    $ tail -f logs/ppv4.log | grep Auth
    ```

   > **Aviso**: `grep` diferencia maiúsculas e minúsculas. Certifique-se de que `Auth` tem sua primeira letra maiúscula.

-  Ligue a alimentação dos gateways, armando os disjuntores de número 1 azul e vermelho no quadro de energia.

-  O último comando executado deverá retornar 16 linhas, uma representando cada gateway. Caso isso não aconteça, algo errado aconteceu, e você deverá reiniciar os gateways.

-  Após todos os gateways serem mostrados na tela, pressione <kbd>ctrl</kbd> + <kbd>c</kbd> para encerrar o comando atual.

-  Volte ao terminal do `supervisor` usando o comando:

    ```
    $ supervisorctl
    ```

    Pressione <kbd>Enter</kbd>

-  Inicie o `animationMapRouter` usando o seguinte comando:

    ```
    supervisor> start animationMapRouter
    ```

    Pressione <kbd>Enter</kbd>

-  Saia do console do `supervisor` usando o comando `exit` e pressionando <kbd>Enter</kbd>

-  Prepare-se para ler os logs do `AnimationMapRouter`, que indicará quantos motores foram mapeados, usando o seguinte comando:

    ```
    $ tail -f logs/animationMapRouter.log | grep Garanteed
    ```

    Pressione <kbd>Enter</kbd>

-  Inicie o processo de ligar os grids na seqüência marcada no painel. Acompanhe a contagem e quantidade exibida no Mac.

-  Após o processo de mapeamento ser concluído, pressione <kbd>ctrl</kbd> + <kbd>c</kbd> para encerrar o processo exibindo os logs.

-  Volte para o console do `supervisor` executando novamente o comando `supervisorctl` e pressionando <kbd>Enter</kbd>. Pare o `AnimationMapRouter` usando o seguinte comando:

    ```
    supervisor> stop animationMapRouter
    ```

-  Inicie o processo de calibração executando o seguinte comando:

    ```
    supervisor> start calibration
    ```

    Aguarde 10 segundos, e pare o processo:

    ```
    supervisor> stop calibration
    ```

-  Reinicie o `AnimationMapRouter`:

    ```
    supervisor> start animationMapRouter
    ```

-  Saia do console do `supervisor` usando novamente o comando `exit`. Acompanhe o progresso do remapeamento através do seguinte comando:

    ```
    $ tail -f logs/animationMapRouter.log | grep Garanteed```
    ```

    Aguarde até que o mapeamento seja concluído, e pressione <kbd>ctrl</kbd> + <kbd>c</kbd> para encerrar o processo exibindo o log.

-  Volte para o console do `supervisor` usando o comando `supervisorctl`. Inicie os processos `socket`, `fft` e `processor` usando o seguinte comando:

    ```
    supervisor> start socket processor fft
    ```

-  Se tudo correu bem, abra o Firefox no Mac, e aponte para o endereço `http://192.168.42.10:3000`. O simulador será mostrado.

# Iniciando o processo de controle do Lidar

No mac, abrir o projeto Xcode do Lidar e clicar em `Play`. Os lidares se comunicam diretamente com o Mac sem a necessidade de configuração, e o software é responsável por preparar, calcular, e entregar os dados para o backend da pele.
