# Infinite Termo
 
 Infinite Termo é uma versão infinita do jogo Termo, onde você pode jogar sem se preocupar em esperar por uma nova palavra a cada dia. Com uma interface simples e intuitiva, você pode se divertir tentando adivinhar palavras ilimitadas vezes.
 
## Créditos
    
O jogo original Wordle foi criado por Josh Wardle. A versão Termo em português foi desenvolvida por Fernando Serboncini.

Este projeto Infinite Termo é uma adaptação do Termo, desenvolvida por David Santos.

## O que diferencia o Infinite Termo do Termo?
- Jogue quantas vezes quiser, sem esperar por uma nova palavra.
- Interface mais moderna e responsiva.
- Compatível com dispositivos móveis e desktops.
- Compartilhamento de resultados com amigos.

## Tecnologias Utilizadas
- Next.js
- TypeScript
- Shadcn UI
- Tailwind CSS
- léxico pt-br (filtrado; 5 letras, sem acentos, sem palavras impróprias; ps: usado também no Termo original)

## Como Jogar

1. Acesse o site do Infinite Termo.
2. Tente adivinhar a palavra de 5 letras em até 6 tentativas (para primeira palavra, 'termo').
    - Para o 'dueto', 7 tentativas.
    - Para o 'quarteto', 9 tentativas.
3. Após cada tentativa, as cores das letras mudarão para mostrar o quão perto você está da palavra correta:
    - Verde: Letra correta na posição correta.
    - Amarelo: Letra correta na posição errada.
    - Cinza: Letra não está na palavra.
4. Continue tentando até adivinhar a palavra correta ou esgotar suas tentativas.
5. Se não conseguir adivinhar a palavra, a resposta correta será revelada após a última tentativa e uma opção para reiniciar o jogo estará disponível.
6. Cada jogo é formado por 7 palavras de 5 letras cada (para o 'dueto', 2 palavras; para o 'quarteto', 4 palavras e 'termo', 1 palavra).
7. Compartilhe seus resultados com amigos e desafie-os a jogar também!

## Processo de Seleção de Palavras

As palavras utilizadas no Infinite Termo são selecionadas a partir de um processo rigoroso de filtragem para garantir uma experiência de jogo justa, educativa e apropriada. O processo inclui os seguintes passos:

1. **Fonte Inicial**: Foi utilizada a lista de palavras do repositório léxico pt-br, que contém uma vasta coleção de termos em português brasileiro (words/lexico.txt). E também o repositório verbete (de csamuelsm) (words/frequency.csv) que fornece uma lista já com 5 letras, porém com nomes próprios e palavras impróprias.

2. **Remoção de Nomes Próprios**: Removemos palavras que começam com maiúscula, identificadas como nomes próprios (ex.: Paulo, Maria, etc.). Isso foi feito executando um script Node.js que lê o arquivo frequency.csv, filtra linhas onde a palavra (primeira coluna) começa com letra minúscula, e salva o resultado em frequency_filtered.csv.

3. **Filtragem por Frequência**: Mantemos apenas palavras com frequência de uso superior a 0.2278685218794112, baseada em dados de frequência de palavras em português brasileiro, garantindo que as palavras sejam relativamente comuns e conhecidas. O valor de corte foi determinado analisando a distribuição de frequências no arquivo frequency_filtered.csv, selecionando palavras acima desse threshold para priorizar termos familiares.

4. **Cruzamento de Listas**: Realizamos um cruzamento entre a lista (words/lexico.txt) e a lista filtrada por frequência (words/frequency_filtered.csv) para garantir que apenas palavras presentes em ambas as listas fossem mantidas. Um script Node.js foi usado para: (a) filtrar palavras de 5 letras de lexico.txt, criando um conjunto (Set); (b) ler frequency_filtered.csv e manter apenas palavras com frequência > 0.2278685218794112 que estejam no conjunto de lexico.txt; (c) salvar o resultado em playable_words.txt.

5. **Remoção de Palavras Impróprias**: Excluímos termos considerados impróprios, vulgares ou ofensivos, utilizando uma lista de referência (words/negativas.txt). Um script Node.js leu negativas.txt para criar um conjunto de palavras proibidas, depois filtrou playable_words.txt removendo qualquer palavra presente nesse conjunto, atualizando o arquivo final.

6. **Conversão de .txt para .json**: Para facilitar o uso no backend, convertimos a lista final de palavras elegíveis (playable_words.txt) para um formato JSON (playable_words.json), onde cada palavra é um item em um array. Isso foi feito usando um script Node.js que leu playable_words.txt, criou um array de palavras e salvou como playable_words.json.

Após esses filtros, restam aproximadamente 1797 palavras elegíveis, selecionadas de forma ponderada pela frequência para priorizar termos mais comuns (words/playable_words.txt).
