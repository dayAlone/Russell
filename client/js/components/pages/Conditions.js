import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Title from '../layout/Title'
import Breadcrumbs from '../ui/Breadcrumbs'

class PageConditions extends Component {
    
    render() {
        return <div className='page page--collections'>
            <Title />
            <Breadcrumbs routes={this.props.routes} />
            <Helmet title={'Russell Hobbs | Условия использования сайта'}/>

            <div className='text'>
                <h2>Условия проведения акции</h2>
            	<p>Настоящая Политика конфиденциальности регулирует порядок обработки и использования персональных и иных данных, полученных с использованием сайта компании АО «Спектрум Брэндс» (далее - Администрация Сайта), а также информирует о способах сбора и хранения полученной персональной информации и пользования Сайтом.
            	</p>

            	<p>Передавая Администрации Сайта персональные и иные данные посредством Сайта, Пользователь подтверждает свое согласие на использование указанных данных на условиях, изложенных в настоящей Политике конфиденциальности.
            	</p>

            	<p>Если Пользователь не согласен хотя бы с одним из условий настоящей Политики, он не должен передавать свои персональные данные и обязан прекратить использование Сайта. Безусловным акцептом настоящей Политики конфиденциальности является начало использования Сайта Пользователем и предоставление персональных данных.
            	</p>

            	<p>1. Теримины</p>
            	<p>1.1. Сайт - сайт, расположенный в сети Интернет по адресу <strong>russellhobbs-promo.com и russellhobbs-promo.ru,</strong> а также страницы на его дочерних доменах. Все исключительные права на Сайт и его отдельные элементы (включая программное обеспечение, дизайн) принадлежат Администрации Сайта в полном объеме. Передача исключительных прав Пользователю не является предметом настоящей Политики конфиденциальности.
            	</p>
            	<p>1.2. Пользователь — лицо использующее Сайт.
            	</p>
            	<p>1.3. Персональные данные — персональные данные Пользователя, которые Пользователь предоставляет о себе самостоятельно при Регистрации или в процессе использования функционала Сайта.
            	</p>
            	<p>1.4. Данные – иные данные Пользователя.
            	</p>
            	<p>1.4. Регистрация —путем входа через имеющийся аккаунт Пользователя (социальная сеть ВКОНТАКТЕ или ФЕЙСБУК).
            	</p>

            	<p>2. Условия пользования Сайтом
            	</p>
            	<ul>
            		<li>2.1. Администрация Сайта, исходит из того, что Пользователь:</li>
            		<ul>
            			<li>обладает всеми необходимыми правами, позволяющими ему осуществлять регистрацию и использовать настоящий Сайт;</li>
            			<li>понимает, что информация на Сайте, размещаемая Пользователем о себе, может становиться доступной для других Пользователей Сайта и пользователей Интернета, может быть скопирована и распространена такими пользователями;</li>
            			<li>ознакомлен с настоящими Правилами, выражает свое согласие с ними и принимает на себя указанные в них права и обязанности.</li>
            		</ul>
            		<li>2.2. Администрация Сайта не проверяет достоверность получаемой (собираемой) информации о пользователях, за исключением случаев, когда такая проверка необходима в целях исполнения Администрацией Сайта обязательств перед пользователем, в том числе Правилами Конкурсов, Розыгрышей или иных акций.</li>
            	</ul>

            	<p>3. Цели обработки информации
            	</p>
            	<p>Администрация Сайта осуществляет обработку информации о Пользователях, в том числе их персональных данных, в целях выполнения обязательств Администрации Сайта перед Пользователями в отношении использования Сайта и его сервисов. Администрация Сайта обязуется использовать Персональные данные в соответствии с Федеральным Законом «О персональных данных» № 152-ФЗ от 27 июля 2006 г. и внутренними документами Администрации Сайта.
            	</p>
            	<p>Администрация Сайта осуществляет надлежащую защиту Персональных и иных данных в соответствии с Законодательством и принимает необходимые и достаточные организационные и технические меры для защиты Персональных данных и иных данных Пользователя.
            	</p>

            	<p>4. Состав информации о пользователях
            	</p>
            	<ul>
            		<li>4.1. Персональные данные Пользователей</li>
            		<li>Персональные данные Пользователей включают в себя:</li>
            		<ul>
            			<li>4.1.1. предоставляемые Пользователями и минимально необходимые для регистрации на Сайте: имя, фамилия, адрес электронной почты;</li>
            			<li>4.1.2. предоставляемые Пользователями с использованием раздела личного профиля </li>
            		</ul>
            		<li>4.2. Иная информация о Пользователях, обрабатываемая Администрацией Сайта</li>
            		<li>Администрация Сайта обрабатывает также иную информацию о Пользователях, которая включает в себя:</li>
            		<ul>
            			<li>4.2.1. стандартные данные, автоматически получаемые http-сервером при доступе к Сайту и последующих действиях Пользователя (IP-адрес хост, вид операционной системы пользователя, страницы Сайта, посещаемые пользователем). Информация, содержащая историю посещения Сайта пользователем;</li>
            			<li>4.2.2. информация, автоматически получаемая при доступе к Сайту с использованием закладок (cookies);</li>
            			<li>4.2.3. информация, создаваемая пользователями на Сайте (в том числе статусы, записи в микроблоге, фотографии, аудиозаписи, видеозаписи, комментарии, записи в обсуждениях групп);</li>
            			<li>4.2.4. информация, полученная в результате действий Пользователя на Сайте (в частности, информация о вступлении в группу / выходе из группы, добавлении других Пользователей в список друзей, размещении фотографий, принятии участия / отказа от участия во встречах, добавлении видеозаписей). Данная информация о Пользователе может быть доступна для всех друзей пользователя в соответствии с настройками пользователя;</li>
            			<li>4.2.5. информация, полученная в результате действий других пользователей на Сайте (в частности, отметки, сделанные на видеозаписях и фотографиях другими Пользователями).</li>
            		</ul>
            	</ul>

            	<p>5. На Сайте используются плагины следующих социальных сетей: facebook.com («Facebook») и Вконтакте vk.com
            	</p>
            	<p>6. Все возможные споры, вытекающие из настоящей Политики конфиденциальности подлежат разрешению в соответствии с действующим законодательством по месту регистрации Администрации Сайта.
            	</p>
            	<p>7. Перед обращением в суд стороны должны соблюсти обязательный досудебный порядок и направить Администрации Сайта соответствующую претензию в письменном виде и на почту <a href='mailto:///support@russellhobbs-promo.ru' target='_blank' class='external'>support@russellhobbs-promo.ru</a>
            	</p>
            	<p>Срок ответа на претензию составляет 30 (тридцать) рабочих дней.
            	</p>
            	<p>8. Если по тем или иным причинам одно или несколько положений Политики конфиденциальности будут признаны недействительными или не имеющими юридической силы, это не оказывает влияния на действительность или применимость остальных положений Политики конфиденциальности.
            	</p>
            	<p>9. Администрация Сайта имеет право в любой момент изменять Политику конфиденциальности (полностью или в части) в одностороннем порядке без предварительного согласования с Пользователем. Все изменения вступают в силу на следующий день после размещения на Сайте.
            	</p>
            	<p>10. Пользователь обязуется самостоятельно следить за изменениями Политики конфиденциальности путем ознакомления с актуальной редакцией.
            	</p>
            	<p>11. Пользователю при использовании Сайта запрещается:
            	</p>
            	<ul>
            		<li>регистрироваться в качестве Пользователя от имени или вместо другого лица («фальшивый аккаунт») или регистрировать группу (объединение) лиц или юридическое лицо в качестве Пользователя. При этом, возможна регистрация от имени и поручению другого физического лица или юридического лица при условии получения необходимых полномочий в порядке и форме, предусмотренных законодательством Российской Федерации;</li>
            		<li>вводить Пользователей в заблуждение относительно своей личности, используя логин и пароль другого зарегистрированного Пользователя;</li>
            		<li>искажать сведения о себе, своем возрасте или своих отношениях с другими лицами или организациями;</li>
            		<li>загружать, хранить, публиковать, распространять и предоставлять доступ или иным образом использовать любую информацию, которая:</li>
            		<li><strong>(а)</strong> содержит угрозы, дискредитирует, оскорбляет, порочит честь и достоинство или деловую репутацию или нарушает неприкосновенность частной жизни других Пользователей или третьих лиц;</li>
            		<li><strong>(б)</strong> нарушает права несовершеннолетних лиц;</li>
            		<li><strong>(в)</strong> является вульгарной или непристойной, содержит порнографические изображения и тексты или сцены сексуального характера с участием несовершеннолетних;</li>
            		<li><strong>(г)</strong> содержит сцены бесчеловечного обращения с животными;</li>
            		<li><strong>(д)</strong> содержит описание средств и способов суицида, любое подстрекательство к его совершению;</li>
            		<li><strong>(е)</strong> пропагандирует и/или способствует разжиганию расовой, религиозной, этнической ненависти или вражды, пропагандирует фашизм или идеологию расового превосходства;</li>
            		<li><strong>(ж)</strong> содержит экстремистские материалы;</li>
            		<li><strong>(з)</strong> пропагандирует преступную деятельность или содержит советы, инструкции или руководства по совершению преступных действий;</li>
            		<li><strong>(и)</strong> содержит информацию ограниченного доступа, включая, но не ограничиваясь, государственной и коммерческой тайной, информацией о частной жизни третьих лиц;</li>
            		<li><strong>(к)</strong> содержит рекламу или описывает привлекательность употребления наркотических веществ, в том числе «цифровых наркотиков» (звуковых файлов, оказывающих воздействие на мозг человека за счет бинауральных ритмов), информацию о распространении наркотиков, рецепты их изготовления и советы по употреблению;</li>
            		<li><strong>(л)</strong> носит мошеннический характер;</li>
            		<li><strong>(м)</strong> а также нарушает иные права и интересы граждан и юридических лиц или требования законодательства Российской Федерации.</li>
            		<li>незаконно загружать, хранить, публиковать, распространять и предоставлять доступ или иным образом использовать интеллектуальную собственность Пользователей и третьих лиц;</li>
            		<li>осуществлять массовые рассылки сообщений в адрес других Пользователей Сайта без их согласия;</li>
            		<li>использовать программное обеспечение и осуществлять действия, направленные на нарушение нормального функционирования Сайта или персональных страниц Пользователей;</li>
            		<li>загружать, хранить, публиковать, распространять и предоставлять доступ или иным образом использовать вирусы, трояны и другие вредоносные программы;</li>
            		<li>использовать без специального на то разрешения Администрации Сайта автоматизированные скрипты (программы) для сбора информации на Сайте и/или взаимодействия с Сайтом и его функционалом;</li>
            		<li>любым способом, в том числе, но не ограничиваясь, путем обмана, злоупотребления доверием, взлома, пытаться получить доступ к логину и паролю другого Пользователя;</li>
            		<li>осуществлять незаконные сбор и обработку персональных данных других лиц;</li>
            		<li>осуществлять использование Сайта иным способом, кроме как через интерфейс, предоставленный Администрацией Сайта, за исключением случаев, когда такие действия были прямо разрешены Пользователю в соответствии с отдельным соглашением с Администрацией;</li>
            		<li>размещать коммерческую и политическую рекламу вне специальных разделов Сайта, установленных Администрацией Сайта;</li>
            		<li>размещать любую другую информацию, которая, по личному мнению Администрации Сайта, является нежелательной, не соответствует целям создания Сайта, ущемляет интересы Пользователей или по другим причинам является нежелательной для размещения на Сайте;</li>
            		<li>осуществлять самостоятельно либо от имени других Пользователей с использованием функционала их аккаунта, в том числе путем введения в заблуждение или с обещанием поощрения, в том числе с использованием любых программ, автоматизированных скриптов, массовые однотипные действия, направленные на искусственное повышение показателей счётчиков Сайта.</li>
            	</ul>
            	<p>12. Пользователь может удалить свой аккаунт и персональные данные на Сайте, написав заявку на <a href='mailto:///support@russellhobbs-promo.ru' target='_blank' class='external'>support@russellhobbs-promo.ru</a>
            	</p>

            </div>
        </div>
    }
}
export default PageConditions
