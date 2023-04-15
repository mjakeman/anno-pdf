import PrimaryButton from "../../PrimaryButton";
import Container from "../../Container";

export default function Terms() {
    return (
        <Container>
            <section className="my-12">
                <p className="text-neutral-400 dark:text-white">Terms</p>
                <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">Terms of Use and Privacy Policy</h1>
                {/*TODO: replace with actual policies */}
                <div className="text-lg dark:text-white mt-12 text-justify">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam commodo est magna, a convallis dolor
                        lacinia at. Nullam tellus nisl, vestibulum a diam vitae, volutpat maximus orci. Nam est enim,
                        blandit at orci tempus, dictum porttitor justo. Phasellus ac sagittis odio. Fusce vulputate
                        consequat arcu, in pellentesque nisl. Sed eget sapien pretium, molestie orci nec, ultrices ipsum.
                        Phasellus pharetra urna quis vulputate venenatis. Praesent lacus massa, accumsan et facilisis nec,
                        aliquet ac tellus.
                    </p>
                    <br />
                    <p>
                        Duis orci sem, hendrerit bibendum mauris sit amet, iaculis aliquam odio. Aenean et vestibulum risus. Mauris quis elit sollicitudin, sagittis sapien vel, iaculis ante. Sed at dui tortor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus non fringilla mauris. Maecenas euismod metus ut lobortis gravida. Aliquam erat volutpat. Ut auctor leo a commodo hendrerit. Integer facilisis massa dui, vel euismod mauris laoreet eget. Curabitur porta est sit amet dui pellentesque scelerisque. Donec at dui quis ipsum condimentum ultrices vitae eu nulla. Nam dictum turpis ex, sed tincidunt erat blandit non. Praesent mollis sem a sem suscipit tincidunt ut nec ex.
                    </p>
                    <br />
                    <ol className="list-decimal ml-8">
                        <li>Duis orci sem, hendrerit bibendum mauris sit amet, iaculis aliquam odio.</li>
                        <li>Maecenas euismod metus ut lobortis gravida</li>
                    </ol>
                    <br />
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam commodo est magna, a convallis dolor lacinia at. Nullam tellus nisl, vestibulum a diam vitae, volutpat maximus orci. Nam est enim, blandit at orci tempus, dictum porttitor.
                    </p>
                </div>
            </section>
        </Container>
    );
}